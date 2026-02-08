using TaskManager.API.Models.DTOs;

namespace TaskManager.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<UserDto> GetCurrentUserAsync(Guid userId);
        string GenerateJwtToken(UserDto user);
    }
}