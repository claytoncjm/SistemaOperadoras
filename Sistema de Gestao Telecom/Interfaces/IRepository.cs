using System.Linq.Expressions;

namespace Sistema_de_Gestao_Telecom.Interfaces
{
    public interface IRepository<T> where T : class
    {
        /// <summary>
        /// Obtém uma entidade pelo seu ID
        /// </summary>
        /// <param name="id">ID da entidade a ser encontrada</param>
        /// <returns>A entidade encontrada ou null</returns>
        Task<T> Get(int id);

        /// <summary>
        /// Obtém todas as entidades do tipo T
        /// </summary>
        /// <returns>Lista de todas as entidades</returns>
        Task<IEnumerable<T>> GetAll();

        /// <summary>
        /// Busca entidades que atendam a uma condição específica
        /// </summary>
        /// <param name="predicate">Expressão lambda com a condição de busca</param>
        /// <returns>Lista de entidades que atendem à condição</returns>
        Task<IEnumerable<T>> Find(Expression<Func<T, bool>> predicate);

        /// <summary>
        /// Adiciona uma nova entidade ao repositório
        /// </summary>
        /// <param name="entity">Entidade a ser adicionada</param>
        Task Add(T entity);

        /// <summary>
        /// Atualiza uma entidade existente
        /// </summary>
        /// <param name="entity">Entidade a ser atualizada</param>
        Task Update(T entity);

        /// <summary>
        /// Remove uma entidade do repositório
        /// </summary>
        /// <param name="entity">Entidade a ser removida</param>
        Task Delete(T entity);

        /// <summary>
        /// Salva todas as alterações feitas no repositório
        /// </summary>
        Task SaveChanges();
    }
}
