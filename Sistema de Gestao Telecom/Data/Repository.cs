using Microsoft.EntityFrameworkCore;
using Sistema_de_Gestao_Telecom.Interfaces;
using System.Linq.Expressions;

namespace Sistema_de_Gestao_Telecom.Data
{
    public class Repository<T> : IRepository<T> where T : class
    {
        // Contexto do banco de dados compartilhado entre todos os repositórios
        protected readonly ApplicationDbContext _context;
        // DbSet específico para a entidade atual, otimiza as consultas
        protected readonly DbSet<T> _dbSet;

        public Repository(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public virtual async Task<T> Get(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public virtual async Task<IEnumerable<T>> GetAll()
        {
            return await _dbSet.ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> Find(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public virtual async Task Add(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public virtual async Task Update(T entity)
        {
            _dbSet.Update(entity);
            await Task.CompletedTask;
        }

        public virtual async Task Delete(T entity)
        {
            _dbSet.Remove(entity);
            await Task.CompletedTask;
        }

        public virtual async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
    }
}
