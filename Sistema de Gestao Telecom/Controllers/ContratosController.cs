using Microsoft.AspNetCore.Mvc;
using Sistema_de_Gestao_Telecom.DTOs;
using Sistema_de_Gestao_Telecom.Interfaces;
using Sistema_de_Gestao_Telecom.Models;

namespace Sistema_de_Gestao_Telecom.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContratosController : ControllerBase
    {
        private readonly IContratoRepository _contratoRepository;
        private readonly IOperadoraRepository _operadoraRepository;

        public ContratosController(IContratoRepository contratoRepository, IOperadoraRepository operadoraRepository)
        {
            _contratoRepository = contratoRepository;
            _operadoraRepository = operadoraRepository;
        }

        /// <summary>
        /// Obtém todos os contratos
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContratoDTO>>> GetContratos()
        {
            var contratos = await _contratoRepository.GetAll();
            var contratosDto = contratos.Select(c => new ContratoDTO
            {
                Id = c.Id,
                NomeFilial = c.NomeFilial,
                OperadoraId = c.OperadoraId,
                NomeOperadora = c.Operadora?.Nome,
                PlanoContratado = c.PlanoContratado,
                DataInicio = c.DataInicio,
                DataVencimento = c.DataVencimento,
                ValorMensal = c.ValorMensal,
                Status = c.Status
            });

            return Ok(contratosDto);
        }

        /// <summary>
        /// Obtém um contrato específico pelo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ContratoDTO>> GetContrato(int id)
        {
            var contrato = await _contratoRepository.Get(id);
            if (contrato == null)
                return NotFound();

            var contratoDto = new ContratoDTO
            {
                Id = contrato.Id,
                NomeFilial = contrato.NomeFilial,
                OperadoraId = contrato.OperadoraId,
                NomeOperadora = contrato.Operadora?.Nome,
                PlanoContratado = contrato.PlanoContratado,
                DataInicio = contrato.DataInicio,
                DataVencimento = contrato.DataVencimento,
                ValorMensal = contrato.ValorMensal,
                Status = contrato.Status
            };

            return Ok(contratoDto);
        }

        /// <summary>
        /// Cria um novo contrato
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ContratoDTO>> CreateContrato(CreateContratoDTO createDto)
        {
            var operadora = await _operadoraRepository.Get(createDto.OperadoraId);
            if (operadora == null)
                return BadRequest("Operadora não encontrada.");

            var contrato = new Contrato
            {
                NomeFilial = createDto.NomeFilial,
                OperadoraId = createDto.OperadoraId,
                PlanoContratado = createDto.PlanoContratado,
                DataInicio = createDto.DataInicio,
                DataVencimento = createDto.DataVencimento,
                ValorMensal = createDto.ValorMensal,
                Status = createDto.Status
            };

            await _contratoRepository.Add(contrato);
            await _contratoRepository.SaveChanges();

            var contratoDto = new ContratoDTO
            {
                Id = contrato.Id,
                NomeFilial = contrato.NomeFilial,
                OperadoraId = contrato.OperadoraId,
                NomeOperadora = operadora.Nome,
                PlanoContratado = contrato.PlanoContratado,
                DataInicio = contrato.DataInicio,
                DataVencimento = contrato.DataVencimento,
                ValorMensal = contrato.ValorMensal,
                Status = contrato.Status
            };

            return CreatedAtAction(nameof(GetContrato), new { id = contrato.Id }, contratoDto);
        }

        /// <summary>
        /// Atualiza um contrato existente
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContrato(int id, UpdateContratoDTO updateDto)
        {
            var contrato = await _contratoRepository.Get(id);
            if (contrato == null)
                return NotFound();

            var operadora = await _operadoraRepository.Get(updateDto.OperadoraId);
            if (operadora == null)
                return BadRequest("Operadora não encontrada.");

            contrato.NomeFilial = updateDto.NomeFilial;
            contrato.OperadoraId = updateDto.OperadoraId;
            contrato.PlanoContratado = updateDto.PlanoContratado;
            contrato.DataVencimento = updateDto.DataVencimento;
            contrato.ValorMensal = updateDto.ValorMensal;
            contrato.Status = updateDto.Status;

            await _contratoRepository.Update(contrato);
            await _contratoRepository.SaveChanges();

            return NoContent();
        }

        /// <summary>
        /// Remove um contrato
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContrato(int id)
        {
            var contrato = await _contratoRepository.Get(id);
            if (contrato == null)
                return NotFound();

            await _contratoRepository.Delete(contrato);
            await _contratoRepository.SaveChanges();

            return NoContent();
        }

        /// <summary>
        /// Obtém contratos por operadora
        /// </summary>
        [HttpGet("operadora/{operadoraId}")]
        public async Task<ActionResult<IEnumerable<ContratoDTO>>> GetContratosPorOperadora(int operadoraId)
        {
            var contratos = await _contratoRepository.GetPorOperadora(operadoraId);
            var contratosDto = contratos.Select(c => new ContratoDTO
            {
                Id = c.Id,
                NomeFilial = c.NomeFilial,
                OperadoraId = c.OperadoraId,
                NomeOperadora = c.Operadora?.Nome,
                PlanoContratado = c.PlanoContratado,
                DataInicio = c.DataInicio,
                DataVencimento = c.DataVencimento,
                ValorMensal = c.ValorMensal,
                Status = c.Status
            });

            return Ok(contratosDto);
        }

        /// <summary>
        /// Obtém contratos por filial
        /// </summary>
        [HttpGet("filial/{nomeFilial}")]
        public async Task<ActionResult<IEnumerable<ContratoDTO>>> GetContratosPorFilial(string nomeFilial)
        {
            var contratos = await _contratoRepository.GetPorFilial(nomeFilial);
            var contratosDto = contratos.Select(c => new ContratoDTO
            {
                Id = c.Id,
                NomeFilial = c.NomeFilial,
                OperadoraId = c.OperadoraId,
                NomeOperadora = c.Operadora?.Nome,
                PlanoContratado = c.PlanoContratado,
                DataInicio = c.DataInicio,
                DataVencimento = c.DataVencimento,
                ValorMensal = c.ValorMensal,
                Status = c.Status
            });

            return Ok(contratosDto);
        }

        /// <summary>
        /// Obtém contratos próximos do vencimento
        /// </summary>
        [HttpGet("vencendo/{dias}")]
        public async Task<ActionResult<IEnumerable<ContratoDTO>>> GetContratosVencendo(int dias)
        {
            var contratos = await _contratoRepository.GetVencendo(dias);
            var contratosDto = contratos.Select(c => new ContratoDTO
            {
                Id = c.Id,
                NomeFilial = c.NomeFilial,
                OperadoraId = c.OperadoraId,
                NomeOperadora = c.Operadora?.Nome,
                PlanoContratado = c.PlanoContratado,
                DataInicio = c.DataInicio,
                DataVencimento = c.DataVencimento,
                ValorMensal = c.ValorMensal,
                Status = c.Status
            });

            return Ok(contratosDto);
        }

        /// <summary>
        /// Obtém o valor total dos contratos ativos
        /// </summary>
        [HttpGet("valor-total-ativos")]
        public async Task<ActionResult<decimal>> GetValorTotalContratosAtivos()
        {
            var valorTotal = await _contratoRepository.GetValorTotalAtivos();
            return Ok(valorTotal);
        }
    }
}
