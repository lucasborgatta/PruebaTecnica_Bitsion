using Microsoft.EntityFrameworkCore;
using Seguros.API.Data;
using Seguros.API.Models;

namespace Seguros.API.Services
{
    public class PersonaService : IPersonaService
    {
        private readonly ApplicationDbContext _context;

        public PersonaService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Persona>> GetPersonasAsync()
        {
            return await _context.Personas.ToListAsync();
        }

        public async Task<(bool Success, string? Error, Persona? Persona)> CreatePersonaAsync(Persona persona)
        {
            if (string.IsNullOrWhiteSpace(persona.FullName))
                return (false, "El nombre es obligatorio", null);

            if (string.IsNullOrWhiteSpace(persona.Identification))
                return (false, "La identificación es obligatoria", null);

            if (string.IsNullOrWhiteSpace(persona.Gender))
                return (false, "El género es obligatorio", null);

            if (persona.Age < 18)
                return (false, "Edad mínima 18", null);

            _context.Personas.Add(persona);
            await _context.SaveChangesAsync();
            return (true, null, persona);
        }

        public async Task<(bool Success, string? Error)> UpdatePersonaAsync(int id, Persona persona)
        {
            if (id != persona.Id)
                return (false, "Id no coincide");

            var existingPersona = await _context.Personas.FindAsync(id);
            if (existingPersona == null)
                return (false, "No encontrada");

            existingPersona.FullName = persona.FullName;
            existingPersona.Identification = persona.Identification;
            existingPersona.Age = persona.Age;
            existingPersona.Gender = persona.Gender;
            existingPersona.IsActive = persona.IsActive;
            existingPersona.Drives = persona.Drives;
            existingPersona.UsesGlasses = persona.UsesGlasses;
            existingPersona.IsDiabetic = persona.IsDiabetic;
            existingPersona.OtherDiseases = persona.OtherDiseases;
            existingPersona.AditionalData = persona.AditionalData;

            await _context.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool Success, string? Error)> DeletePersonaAsync(int id)
        {
            var existingPersona = await _context.Personas.FindAsync(id);
            if (existingPersona == null)
                return (false, "No encontrada");

            _context.Personas.Remove(existingPersona);
            await _context.SaveChangesAsync();
            return (true, null);
        }

        public async Task<List<Persona>> FilterPersonasAsync(
        string? fullName,
        string? identification,
        int? age,
        string? gender,
        bool? isActive,
        bool? drives,
        bool? usesGlasses,
        bool? isDiabetic
)
        {
            var query = _context.Personas.AsQueryable();

            if (!string.IsNullOrWhiteSpace(fullName))
                query = query.Where(p => p.FullName.Contains(fullName));

            if (!string.IsNullOrWhiteSpace(identification))
                query = query.Where(p => p.Identification.Contains(identification));

            if (age.HasValue)
                query = query.Where(p => p.Age == age.Value);

            if (!string.IsNullOrWhiteSpace(gender))
                query = query.Where(p => p.Gender == gender);

            if (isActive.HasValue)
                query = query.Where(p => p.IsActive == isActive.Value);

            if (drives.HasValue)
                query = query.Where(p => p.Drives == drives.Value);

            if (usesGlasses.HasValue)
                query = query.Where(p => p.UsesGlasses == usesGlasses.Value);

            if (isDiabetic.HasValue)
                query = query.Where(p => p.IsDiabetic == isDiabetic.Value);

            return await query.ToListAsync();
        }

    }
}
