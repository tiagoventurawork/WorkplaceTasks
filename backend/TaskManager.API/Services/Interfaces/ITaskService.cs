using TaskManager.API.Models.DTOs;
using TaskManager.API.Models.Enums;

namespace TaskManager.API.Services.Interfaces
{
    public interface ITaskService
    {
        Task<PaginatedResponse<TaskResponseDto>> GetTasksAsync(
            TaskQueryParameters parameters, Guid currentUserId, UserRole userRole);
        Task<TaskResponseDto> GetTaskByIdAsync(Guid id);
        Task<TaskResponseDto> CreateTaskAsync(CreateTaskDto dto, Guid createdById);
        Task<TaskResponseDto> UpdateTaskAsync(
            Guid id, UpdateTaskDto dto, Guid currentUserId, UserRole userRole);
        Task<TaskResponseDto> UpdateTaskStatusAsync(
            Guid id, UpdateTaskStatusDto dto, Guid currentUserId, UserRole userRole);
        Task DeleteTaskAsync(Guid id, Guid currentUserId, UserRole userRole);
        Task<bool> CanUserModifyTaskAsync(Guid taskId, Guid userId, UserRole userRole);
        Task<bool> CanUserDeleteTaskAsync(Guid taskId, Guid userId, UserRole userRole);
    }
}