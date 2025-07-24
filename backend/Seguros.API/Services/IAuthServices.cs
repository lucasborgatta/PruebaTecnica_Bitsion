using Seguros.API.DTOs;
using Seguros.API.Models;

namespace Seguros.API.Services
{
    public interface IAuthService
    {
        Task<(bool Success, string? Error)> RegisterAsync(RegisterDto request);
        Task<(bool Success, string? Error, string? Token)> LoginAsync(LoginDto request);
    }
}
