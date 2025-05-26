using Microsoft.AspNetCore.Mvc;
using Sistema_de_Gestao_Telecom.DTOs;
using Sistema_de_Gestao_Telecom.Interfaces;
using Sistema_de_Gestao_Telecom.Models;

namespace Sistema_de_Gestao_Telecom.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OperadorasController : ControllerBase
    {
        private readonly IOperadoraRepository _operadoraRepository;

        public OperadorasController(IOperadoraRepository operadoraRepository)
        {
            _operadoraRepository = operadoraRepository;
        }

        /// <summary>
        /// Obtém todas as operadoras cadastradas
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OperadoraDTO>>> GetOperadoras()
        {
            var operadoras = await _operadoraRepository.GetAll();
            var operadorasDto = operadoras.Select(o => new OperadoraDTO
            {
                Id = o.Id,
                Nome = o.Nome,
                TipoServico = o.TipoServico,
                ContatoSuporte = o.ContatoSuporte
            });

            return Ok(operadorasDto);
        }

        /// <summary>
        /// Obtém uma operadora específica pelo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<OperadoraDTO>> GetOperadora(int id)
        {
            var operadora = await _operadoraRepository.Get(id);
            if (operadora == null)
                return NotFound();

            var operadoraDto = new OperadoraDTO
            {
                Id = operadora.Id,
                Nome = operadora.Nome,
                TipoServico = operadora.TipoServico,
                ContatoSuporte = operadora.ContatoSuporte
            };

            return Ok(operadoraDto);
        }

        /// <summary>
        /// Cria uma nova operadora
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<OperadoraDTO>> CreateOperadora(CreateOperadoraDTO createDto)
        {
            if (await _operadoraRepository.ExisteComNome(createDto.Nome))
                return BadRequest("Já existe uma operadora com este nome.");

            var operadora = new Operadora
            {
                Nome = createDto.Nome,
                TipoServico = createDto.TipoServico,
                ContatoSuporte = createDto.ContatoSuporte
            };

            await _operadoraRepository.Add(operadora);
            await _operadoraRepository.SaveChanges();

            var operadoraDto = new OperadoraDTO
            {
                Id = operadora.Id,
                Nome = operadora.Nome,
                TipoServico = operadora.TipoServico,
                ContatoSuporte = operadora.ContatoSuporte
            };

            return CreatedAtAction(nameof(GetOperadora), new { id = operadora.Id }, operadoraDto);
        }

        /// <summary>
        /// Atualiza uma operadora existente
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOperadora(int id, UpdateOperadoraDTO updateDto)
        {
            var operadora = await _operadoraRepository.Get(id);
            if (operadora == null)
                return NotFound();

            // Verifica se o novo nome já existe (se foi alterado)
            if (operadora.Nome != updateDto.Nome && await _operadoraRepository.ExisteComNome(updateDto.Nome))
                return BadRequest("Já existe uma operadora com este nome.");

            operadora.Nome = updateDto.Nome;
            operadora.TipoServico = updateDto.TipoServico;
            operadora.ContatoSuporte = updateDto.ContatoSuporte;

            await _operadoraRepository.Update(operadora);
            await _operadoraRepository.SaveChanges();

            return NoContent();
        }

        /// <summary>
        /// Remove uma operadora
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOperadora(int id)
        {
            var operadora = await _operadoraRepository.Get(id);
            if (operadora == null)
                return NotFound();

            await _operadoraRepository.Delete(operadora);
            await _operadoraRepository.SaveChanges();

            return NoContent();
        }

        /// <summary>
        /// Obtém operadoras por tipo de serviço
        /// </summary>
        [HttpGet("tipo/{tipoServico}")]
        public async Task<ActionResult<IEnumerable<OperadoraDTO>>> GetOperadorasPorTipo(TipoServico tipoServico)
        {
            var operadoras = await _operadoraRepository.GetPorTipoServico(tipoServico);
            var operadorasDto = operadoras.Select(o => new OperadoraDTO
            {
                Id = o.Id,
                Nome = o.Nome,
                TipoServico = o.TipoServico,
                ContatoSuporte = o.ContatoSuporte
            });

            return Ok(operadorasDto);
        }
    }
}
