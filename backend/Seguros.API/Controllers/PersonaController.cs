using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Seguros.API.Models;
using Seguros.API.Services;

namespace Seguros.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PersonaController : ControllerBase
    {
        private readonly IPersonaService _personaService;

        public PersonaController(IPersonaService personaService)
        {
            _personaService = personaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPersonas()
        {
            var personas = await _personaService.GetPersonasAsync();
            return Ok(personas);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Persona persona)
        {
            var (success, error, createdPersona) = await _personaService.CreatePersonaAsync(persona);
            if (!success)
                return BadRequest(error);

            return Ok(createdPersona);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Persona persona)
        {
            var (success, error) = await _personaService.UpdatePersonaAsync(id, persona);
            if (!success)
            {
                if (error == "No encontrada")
                    return NotFound();
                return BadRequest(error);
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var (success, error) = await _personaService.DeletePersonaAsync(id);
            if (!success)
                return NotFound();
            return NoContent();
        }

        [HttpGet("filter")]
        public async Task<IActionResult> Filter(
        [FromQuery] string? fullName,
        [FromQuery] string? identification,
        [FromQuery] int? age,
        [FromQuery] string? gender,
        [FromQuery] bool? isActive,
        [FromQuery] bool? drives,
        [FromQuery] bool? usesGlasses,
        [FromQuery] bool? isDiabetic
)
        {
            var result = await _personaService.FilterPersonasAsync(
                fullName, identification, age, gender,
                isActive, drives, usesGlasses, isDiabetic
            );

            return Ok(result);
        }

    }
}
