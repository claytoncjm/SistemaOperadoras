using Microsoft.EntityFrameworkCore;
using Sistema_de_Gestao_Telecom.Interfaces;
using Sistema_de_Gestao_Telecom.Models;

namespace Sistema_de_Gestao_Telecom.Data
{
    public class OperadoraRepository : Repository<Operadora>, IOperadoraRepository
    {
        // Herda o construtor base para manter a mesma instância do contexto
        public OperadoraRepository(ApplicationDbContext context) : base(context)
        {
        }

        // Obtém operadoras por tipo de serviço
        public async Task<IEnumerable<Operadora>> GetPorTipoServico(TipoServico tipoServico)
        {
            return await _dbSet
                .Where(o => o.TipoServico == tipoServico)
                .ToListAsync();
        }

        public async Task<bool> ExisteComNome(string nome)
        {
            return await _dbSet
                .AnyAsync(o => o.Nome.ToLower() == nome.ToLower());
        }
    }
}
