namespace Seguros.API.Models
{
    public class Persona
    {
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Identification { get; set; } = null!;
        public int Age { get; set; }
        public string Gender { get; set; } = null!;
        public bool IsActive { get; set; }
        public bool Drives { get; set; }
        public bool UsesGlasses { get; set; }
        public bool IsDiabetic { get; set; }
        public string? OtherDiseases { get; set; }
        public string? AditionalData { get; set; }
    }
}
