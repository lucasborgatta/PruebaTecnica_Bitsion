using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Seguros.API.Data;
using Seguros.API.DTOs;
using Seguros.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;

namespace Seguros.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<(bool Success, string? Error)> RegisterAsync(RegisterDto request)
        {
            var emailExists = await _context.Usuarios.AnyAsync(u => u.Email == request.Email);
            if (emailExists)
                return (false, "El email ya se encuentra registrado.");

            var usuario = new Usuario
            {
                Email = request.Email
            };

            var passwordHasher = new PasswordHasher<Usuario>();
            usuario.PasswordHash = passwordHasher.HashPassword(usuario, request.Password);

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return (true, null);
        }

        public async Task<(bool Success, string? Error, string? Token)> LoginAsync(LoginDto request)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (usuario == null)
                return (false, "Usuario no encontrado.", null);

            var passwordHasher = new PasswordHasher<Usuario>();
            var result = passwordHasher.VerifyHashedPassword(usuario, usuario.PasswordHash, request.Password);

            if (result == PasswordVerificationResult.Failed)
                return (false, "Contraseña incorrecta.", null);

            var token = GenerateJwtToken(usuario);

            return (true, null, token);
        }

        private string GenerateJwtToken(Usuario usuario)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuario.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("id", usuario.Id.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
