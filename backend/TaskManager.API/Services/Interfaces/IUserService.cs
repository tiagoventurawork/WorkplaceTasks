using TaskManager.API.Models.DTOs;
using TaskManager.API.Models.Enums;

namespace TaskManager.API.Services.Interfaces
{
    public interface IUserService
    {
        Task<PaginatedResponse<UserDto>> GetUsersAsync(int pageNumber, int pageSize);
        Task<UserDto> GetUserByIdAsync(Guid id);
        Task<UserDto> UpdateUserRoleAsync(Guid id, UserRole newRole);
        Task DeleteUserAsync(Guid id);
    }
}