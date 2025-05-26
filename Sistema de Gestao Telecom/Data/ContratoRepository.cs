using Microsoft.EntityFrameworkCore;
using Sistema_de_Gestao_Telecom.Interfaces;
using Sistema_de_Gestao_Telecom.Models;

namespace Sistema_de_Gestao_Telecom.Data
{
    public class ContratoRepository : Repository<Contrato>, IContratoRepository
    {
        // Herda o construtor base para manter a mesma instância do contexto
        public ContratoRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Contrato>> GetPorOperadora(int operadoraId)
        {
            return await _dbSet
                .Include(c => c.Operadora)
                .Where(c => c.OperadoraId == operadoraId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Contrato>> GetVencendo(int dias)
        {
            // Calcula a data limite para vencimento baseado nos dias informados
            var dataLimite = DateTime.Now.AddDays(dias);
            // Busca contratos ativos que vencem até a data limite
            return await _dbSet
                .Include(c => c.Operadora)
                .Where(c => c.DataVencimento <= dataLimite && c.Status == StatusContrato.Ativo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Contrato>> GetPorFilial(string nomeFilial)
        {
            return await _dbSet
                .Include(c => c.Operadora)
                .Where(c => c.NomeFilial.ToLower() == nomeFilial.ToLower())
                .ToListAsync();
        }

        public async Task<decimal> GetValorTotalAtivos()
        {
            // Soma o valor mensal de todos os contratos ativos
            // Útil para análises financeiras e dashboards
            return await _dbSet
                .Where(c => c.Status == StatusContrato.Ativo)
                .SumAsync(c => c.ValorMensal);
        }
    }
}
