using Microsoft.AspNetCore.Mvc;
using Sistema_de_Gestao_Telecom.DTOs;
using Sistema_de_Gestao_Telecom.Interfaces;
using Sistema_de_Gestao_Telecom.Models;

namespace Sistema_de_Gestao_Telecom.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FaturasController : ControllerBase
    {
        private readonly IFaturaRepository _faturaRepository;
        private readonly IContratoRepository _contratoRepository;

        public FaturasController(IFaturaRepository faturaRepository, IContratoRepository contratoRepository)
        {
            _faturaRepository = faturaRepository;
            _contratoRepository = contratoRepository;
        }

        /// <summary>
        /// Obtém todas as faturas
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FaturaDTO>>> GetFaturas()
        {
            var faturas = await _faturaRepository.GetAll();
            var faturasDto = faturas.Select(f => new FaturaDTO
            {
                Id = f.Id,
                ContratoId = f.ContratoId,
                NomeFilial = f.Contrato?.NomeFilial,
                NomeOperadora = f.Contrato?.Operadora?.Nome,
                DataEmissao = f.DataEmissao,
                DataVencimento = f.DataVencimento,
                ValorCobrado = f.ValorCobrado,
                Status = f.Status
            });

            return Ok(faturasDto);
        }

        /// <summary>
        /// Obtém uma fatura específica pelo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<FaturaDTO>> GetFatura(int id)
        {
            var fatura = await _faturaRepository.Get(id);
            if (fatura == null)
                return NotFound();

            var faturaDto = new FaturaDTO
            {
                Id = fatura.Id,
                ContratoId = fatura.ContratoId,
                NomeFilial = fatura.Contrato?.NomeFilial,
                NomeOperadora = fatura.Contrato?.Operadora?.Nome,
                DataEmissao = fatura.DataEmissao,
                DataVencimento = fatura.DataVencimento,
                ValorCobrado = fatura.ValorCobrado,
                Status = fatura.Status
            };

            return Ok(faturaDto);
        }

        /// <summary>
        /// Cria uma nova fatura
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<FaturaDTO>> CreateFatura(CreateFaturaDTO createDto)
        {
            var contrato = await _contratoRepository.Get(createDto.ContratoId);
            if (contrato == null)
                return BadRequest("Contrato não encontrado.");

            var fatura = new Fatura
            {
                ContratoId = createDto.ContratoId,
                DataEmissao = createDto.DataEmissao,
                DataVencimento = createDto.DataVencimento,
                ValorCobrado = createDto.ValorCobrado,
                Status = createDto.Status
            };

            await _faturaRepository.Add(fatura);
            await _faturaRepository.SaveChanges();

            var faturaDto = new FaturaDTO
            {
                Id = fatura.Id,
                ContratoId = fatura.ContratoId,
                NomeFilial = contrato.NomeFilial,
                NomeOperadora = contrato.Operadora?.Nome,
                DataEmissao = fatura.DataEmissao,
                DataVencimento = fatura.DataVencimento,
                ValorCobrado = fatura.ValorCobrado,
                Status = fatura.Status
            };

            return CreatedAtAction(nameof(GetFatura), new { id = fatura.Id }, faturaDto);
        }

        /// <summary>
        /// Atualiza uma fatura existente
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFatura(int id, UpdateFaturaDTO updateDto)
        {
            var fatura = await _faturaRepository.Get(id);
            if (fatura == null)
                return NotFound();

            fatura.DataVencimento = updateDto.DataVencimento;
            fatura.ValorCobrado = updateDto.ValorCobrado;
            fatura.Status = updateDto.Status;

            await _faturaRepository.Update(fatura);
            await _faturaRepository.SaveChanges();

            return NoContent();
        }

        /// <summary>
        /// Remove uma fatura
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFatura(int id)
        {
            var fatura = await _faturaRepository.Get(id);
            if (fatura == null)
                return NotFound();

            await _faturaRepository.Delete(fatura);
            await _faturaRepository.SaveChanges();

            return NoContent();
        }

        /// <summary>
        /// Obtém faturas por contrato
        /// </summary>
        [HttpGet("contrato/{contratoId}")]
        public async Task<ActionResult<IEnumerable<FaturaDTO>>> GetFaturasPorContrato(int contratoId)
        {
            var faturas = await _faturaRepository.GetPorContrato(contratoId);
            var faturasDto = faturas.Select(f => new FaturaDTO
            {
                Id = f.Id,
                ContratoId = f.ContratoId,
                NomeFilial = f.Contrato?.NomeFilial,
                NomeOperadora = f.Contrato?.Operadora?.Nome,
                DataEmissao = f.DataEmissao,
                DataVencimento = f.DataVencimento,
                ValorCobrado = f.ValorCobrado,
                Status = f.Status
            });

            return Ok(faturasDto);
        }

        /// <summary>
        /// Obtém faturas por status
        /// </summary>
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<FaturaDTO>>> GetFaturasPorStatus(StatusFatura status)
        {
            var faturas = await _faturaRepository.GetPorStatus(status);
            var faturasDto = faturas.Select(f => new FaturaDTO
            {
                Id = f.Id,
                ContratoId = f.ContratoId,
                NomeFilial = f.Contrato?.NomeFilial,
                NomeOperadora = f.Contrato?.Operadora?.Nome,
                DataEmissao = f.DataEmissao,
                DataVencimento = f.DataVencimento,
                ValorCobrado = f.ValorCobrado,
                Status = f.Status
            });

            return Ok(faturasDto);
        }

        /// <summary>
        /// Obtém faturas vencidas
        /// </summary>
        [HttpGet("vencidas")]
        public async Task<ActionResult<IEnumerable<FaturaDTO>>> GetFaturasVencidas()
        {
            var faturas = await _faturaRepository.GetVencidas();
            var faturasDto = faturas.Select(f => new FaturaDTO
            {
                Id = f.Id,
                ContratoId = f.ContratoId,
                NomeFilial = f.Contrato?.NomeFilial,
                NomeOperadora = f.Contrato?.Operadora?.Nome,
                DataEmissao = f.DataEmissao,
                DataVencimento = f.DataVencimento,
                ValorCobrado = f.ValorCobrado,
                Status = f.Status
            });

            return Ok(faturasDto);
        }

        /// <summary>
        /// Obtém o valor total das faturas em um período
        /// </summary>
        [HttpGet("valor-total")]
        public async Task<ActionResult<decimal>> GetValorTotalFaturas([FromQuery] DateTime inicio, [FromQuery] DateTime fim)
        {
            var valorTotal = await _faturaRepository.GetValorTotalPeriodo(inicio, fim);
            return Ok(valorTotal);
        }

        /// <summary>
        /// Obtém a distribuição de faturas por status
        /// </summary>
        [HttpGet("distribuicao-status")]
        public async Task<ActionResult<IDictionary<StatusFatura, int>>> GetDistribuicaoStatus()
        {
            var distribuicao = await _faturaRepository.GetDistribuicaoPorStatus();
            return Ok(distribuicao);
        }
    }
}
