namespace Seguros.API.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
    }
}
