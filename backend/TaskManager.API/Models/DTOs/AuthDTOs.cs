using System.ComponentModel.DataAnnotations;
using TaskManager.API.Models.Enums;

namespace TaskManager.API.Models.DTOs
{
    // DTO LOGIN
    public class LoginDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = string.Empty;
    }

    // DTO REGISTER
    public class RegisterDto
    {
        [Required(ErrorMessage = "Username is required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 100 characters")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; } = string.Empty;

        [Compare("Password", ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }

    // SUCESS regist or login
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;  // JWT Token
        public DateTime Expiration { get; set; }
        public UserDto User { get; set; } = null!;
    }

    // Informação do utilizador (sem password!)
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public string RoleName => Role.ToString();
    }

    // DTO CHANGE role (admin)
    public class UpdateUserRoleDto
    {
        [Required]
        public UserRole Role { get; set; }
    }
}