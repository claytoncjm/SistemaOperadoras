using Microsoft.EntityFrameworkCore;
using Sistema_de_Gestao_Telecom.Interfaces;
using Sistema_de_Gestao_Telecom.Models;

namespace Sistema_de_Gestao_Telecom.Data
{
    public class FaturaRepository : Repository<Fatura>, IFaturaRepository
    {
        // Herda o construtor base para manter a mesma instância do contexto
        public FaturaRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Fatura>> GetPorContrato(int contratoId)
        {
            // Busca faturas por contrato, incluindo dados do contrato
            return await _dbSet
                .Include(f => f.Contrato)
                .Where(f => f.ContratoId == contratoId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Fatura>> GetPorStatus(StatusFatura status)
        {
            // Busca faturas por status, incluindo dados do contrato
            return await _dbSet
                .Include(f => f.Contrato)
                .Where(f => f.Status == status)
                .ToListAsync();
        }

        public async Task<decimal> GetValorTotalPeriodo(DateTime inicio, DateTime fim)
        {
            // Soma o valor total das faturas emitidas entre as datas informadas
            return await _dbSet
                .Where(f => f.DataEmissao >= inicio && f.DataEmissao <= fim)
                .SumAsync(f => f.ValorCobrado);
        }

        public async Task<IDictionary<StatusFatura, int>> GetDistribuicaoPorStatus()
        {
            // Agrupa as faturas por status e conta quantas existem em cada status
            // Útil para gerar gráficos e relatórios de distribuição
            return await _dbSet
                .GroupBy(f => f.Status)
                .ToDictionaryAsync(
                    g => g.Key,
                    g => g.Count()
                );
        }

        public async Task<IEnumerable<Fatura>> GetVencidas()
        {
            // Busca faturas vencidas (data menor que hoje) e não pagas
            // Inclui dados do contrato e operadora para exibição completa
            var hoje = DateTime.Now.Date;
            return await _dbSet
                .Include(f => f.Contrato)
                    .ThenInclude(c => c.Operadora)
                .Where(f => f.DataVencimento < hoje && f.Status != StatusFatura.Paga)
                .ToListAsync();
        }
    }
}
