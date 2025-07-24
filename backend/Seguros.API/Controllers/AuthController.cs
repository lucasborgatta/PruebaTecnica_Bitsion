using Microsoft.AspNetCore.Mvc;
using Seguros.API.DTOs;
using Seguros.API.Services;

namespace Seguros.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto request)
        {
            var (success, error) = await _authService.RegisterAsync(request);
            if (!success)
                return BadRequest(error);

            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto request)
        {
            var (success, error, token) = await _authService.LoginAsync(request);
            if (!success)
                return BadRequest(error);

            return Ok(new { token });
        }
    }
}
