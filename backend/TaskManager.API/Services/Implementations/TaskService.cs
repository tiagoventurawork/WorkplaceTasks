using Microsoft.EntityFrameworkCore;
using TaskManager.API.Data;
using TaskManager.API.Exceptions;
using TaskManager.API.Models.DTOs;
using TaskManager.API.Models.Entities;
using TaskManager.API.Models.Enums;
using TaskManager.API.Services.Interfaces;

namespace TaskManager.API.Services.Implementations
{
    public class TaskService : ITaskService
    {
        private readonly ApplicationDbContext _context;

        public TaskService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResponse<TaskResponseDto>> GetTasksAsync(
            TaskQueryParameters parameters,
            Guid currentUserId,
            UserRole userRole)
        {
            var query = _context.Tasks
                .Include(t => t.CreatedBy)
                .Include(t => t.AssignedTo)
                .AsQueryable();

            // Apply filters
            if (parameters.Status.HasValue)
                query = query.Where(t => t.Status == parameters.Status.Value);

            if (!string.IsNullOrWhiteSpace(parameters.SearchTerm))
            {
                var search = parameters.SearchTerm.ToLower();
                query = query.Where(t =>
                    t.Title.ToLower().Contains(search) ||
                    t.Description.ToLower().Contains(search));
            }

            if (parameters.AssignedToId.HasValue)
                query = query.Where(t => t.AssignedToId == parameters.AssignedToId.Value);

            if (parameters.CreatedById.HasValue)
                query = query.Where(t => t.CreatedById == parameters.CreatedById.Value);

            // Order by newest first
            query = query.OrderByDescending(t => t.CreatedAt);

            var totalCount = await query.CountAsync();

            // Apply pagination
            var tasks = await query
                .Skip((parameters.PageNumber - 1) * parameters.PageSize)
                .Take(parameters.PageSize)
                .ToListAsync();

            return new PaginatedResponse<TaskResponseDto>
            {
                Items = tasks.Select(MapToResponseDto),
                PageNumber = parameters.PageNumber,
                PageSize = parameters.PageSize,
                TotalCount = totalCount
            };
        }

        public async Task<TaskResponseDto> GetTaskByIdAsync(Guid id)
        {
            var task = await _context.Tasks
                .Include(t => t.CreatedBy)
                .Include(t => t.AssignedTo)
                .FirstOrDefaultAsync(t => t.Id == id)
                ?? throw new NotFoundException("Task", id);

            return MapToResponseDto(task);
        }

        public async Task<TaskResponseDto> CreateTaskAsync(CreateTaskDto dto, Guid createdById)
        {
            // Validate assignee exists if provided
            if (dto.AssignedToId.HasValue)
            {
                var assignee = await _context.Users.FindAsync(dto.AssignedToId.Value)
                    ?? throw new BadRequestException("Assigned user not found.");
            }

            var task = new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Description = dto.Description,
                Status = dto.Status,
                CreatedById = createdById,
                AssignedToId = dto.AssignedToId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return await GetTaskByIdAsync(task.Id);
        }

        public async Task<TaskResponseDto> UpdateTaskAsync(
            Guid id,
            UpdateTaskDto dto,
            Guid currentUserId,
            UserRole userRole)
        {
            var task = await _context.Tasks
                .Include(t => t.CreatedBy)
                .Include(t => t.AssignedTo)
                .FirstOrDefaultAsync(t => t.Id == id)
                ?? throw new NotFoundException("Task", id);

            if (!CanModifyTask(task, currentUserId, userRole))
                throw new ForbiddenException("You don't have permission to update this task.");

            if (dto.AssignedToId.HasValue)
            {
                _ = await _context.Users.FindAsync(dto.AssignedToId.Value)
                    ?? throw new BadRequestException("Assigned user not found.");
            }

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.Status = dto.Status;
            task.AssignedToId = dto.AssignedToId;
            task.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToResponseDto(task);
        }

        public async Task<TaskResponseDto> UpdateTaskStatusAsync(
            Guid id,
            UpdateTaskStatusDto dto,
            Guid currentUserId,
            UserRole userRole)
        {
            var task = await _context.Tasks
                .Include(t => t.CreatedBy)
                .Include(t => t.AssignedTo)
                .FirstOrDefaultAsync(t => t.Id == id)
                ?? throw new NotFoundException("Task", id);

            // Members can only update status of their own or assigned tasks
            if (userRole == UserRole.Member)
            {
                var canUpdate = task.CreatedById == currentUserId || task.AssignedToId == currentUserId;
                if (!canUpdate)
                    throw new ForbiddenException("You can only update status of tasks you created or are assigned to.");
            }

            task.Status = dto.Status;
            task.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToResponseDto(task);
        }

        public async Task DeleteTaskAsync(Guid id, Guid currentUserId, UserRole userRole)
        {
            var task = await _context.Tasks.FindAsync(id)
                ?? throw new NotFoundException("Task", id);

            if (!CanDeleteTask(task, currentUserId, userRole))
                throw new ForbiddenException("You don't have permission to delete this task.");

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> CanUserModifyTaskAsync(Guid taskId, Guid userId, UserRole userRole)
        {
            var task = await _context.Tasks.FindAsync(taskId);
            return task != null && CanModifyTask(task, userId, userRole);
        }

        public async Task<bool> CanUserDeleteTaskAsync(Guid taskId, Guid userId, UserRole userRole)
        {
            var task = await _context.Tasks.FindAsync(taskId);
            return task != null && CanDeleteTask(task, userId, userRole);
        }

        // RBAC: Role-Based Access Control logic
        private static bool CanModifyTask(TaskItem task, Guid userId, UserRole userRole)
        {
            return userRole switch
            {
                UserRole.Admin => true,
                UserRole.Manager => true,
                UserRole.Member => task.CreatedById == userId || task.AssignedToId == userId,
                _ => false
            };
        }

        private static bool CanDeleteTask(TaskItem task, Guid userId, UserRole userRole)
        {
            return userRole switch
            {
                UserRole.Admin => true,
                UserRole.Manager => task.CreatedById == userId,
                UserRole.Member => task.CreatedById == userId,
                _ => false
            };
        }

        private static TaskResponseDto MapToResponseDto(TaskItem task)
        {
            return new TaskResponseDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt,
                CreatedById = task.CreatedById,
                CreatedByUsername = task.CreatedBy?.Username ?? "Unknown",
                AssignedToId = task.AssignedToId,
                AssignedToUsername = task.AssignedTo?.Username
            };
        }
    }
}