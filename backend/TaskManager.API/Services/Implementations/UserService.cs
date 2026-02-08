using Microsoft.EntityFrameworkCore;
using TaskManager.API.Data;
using TaskManager.API.Exceptions;
using TaskManager.API.Models.DTOs;
using TaskManager.API.Models.Enums;
using TaskManager.API.Services.Interfaces;

namespace TaskManager.API.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResponse<UserDto>> GetUsersAsync(int pageNumber, int pageSize)
        {
            var totalCount = await _context.Users.CountAsync();

            var users = await _context.Users
                .OrderBy(u => u.Username)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Role = u.Role
                })
                .ToListAsync();

            return new PaginatedResponse<UserDto>
            {
                Items = users,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task<UserDto> GetUserByIdAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id)
                ?? throw new NotFoundException("User", id);

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            };
        }

        public async Task<UserDto> UpdateUserRoleAsync(Guid id, UserRole newRole)
        {
            var user = await _context.Users.FindAsync(id)
                ?? throw new NotFoundException("User", id);

            user.Role = newRole;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            };
        }

        public async Task DeleteUserAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id)
                ?? throw new NotFoundException("User", id);

            // Prevent deletion if user has tasks
            var hasCreatedTasks = await _context.Tasks.AnyAsync(t => t.CreatedById == id);
            if (hasCreatedTasks)
                throw new BadRequestException("Cannot delete user with existing tasks. Reassign or delete tasks first.");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}