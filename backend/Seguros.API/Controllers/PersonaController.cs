using Microsoft.AspNetCore.Mvc;
using Seguros.API.Data;
using Seguros.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Seguros.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PersonaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PersonaController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPersonas()
        {
            var personas = await _context.Personas.ToListAsync();
            return Ok(personas);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Persona persona)
        {
            if (string.IsNullOrWhiteSpace(persona.FullName))
                return BadRequest("El nombre es obligatorio");

            if (string.IsNullOrWhiteSpace(persona.Identification))
                return BadRequest("La identificación es obligatoria");

            if (string.IsNullOrWhiteSpace(persona.Gender))
                return BadRequest("El género es obligatorio");

            if (persona.Age < 18) return BadRequest("Edad mínima 18");

            _context.Personas.Add(persona);
            await _context.SaveChangesAsync();

            return Ok(persona);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Persona persona)
        {
            if (id != persona.Id)
            {
                return BadRequest();
            }

            var existingPersona = await _context.Personas.FindAsync(id);

            if (existingPersona == null)
            {
                return NotFound();
            }

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

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingPerson = await _context.Personas.FindAsync(id);

            if (existingPerson == null)
            {
                return NotFound();
            }

            _context.Personas.Remove(existingPerson);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
