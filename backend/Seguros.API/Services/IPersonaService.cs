using Seguros.API.Models;

namespace Seguros.API.Services
{
    public interface IPersonaService
    {
        Task<List<Persona>> GetPersonasAsync();
        Task<(bool Success, string? Error, Persona? Persona)> CreatePersonaAsync(Persona persona);
        Task<(bool Success, string? Error)> UpdatePersonaAsync(int id, Persona persona);
        Task<(bool Success, string? Error)> DeletePersonaAsync(int id);
        Task<List<Persona>> FilterPersonasAsync(
        string? fullName,
        string? identification,
        int? age,
        string? gender,
        bool? isActive,
        bool? drives,
        bool? usesGlasses,
        bool? isDiabetic
);
    }
}
