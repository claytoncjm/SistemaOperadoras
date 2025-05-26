using Sistema_de_Gestao_Telecom.Models;

namespace Sistema_de_Gestao_Telecom.Interfaces
{
    public interface IOperadoraRepository : IRepository<Operadora>
    {
        /// <summary>
        /// Busca operadoras por tipo de serviço
        /// </summary>
        /// <param name="tipoServico">Tipo de serviço desejado</param>
        /// <returns>Lista de operadoras do tipo especificado</returns>
        Task<IEnumerable<Operadora>> GetPorTipoServico(TipoServico tipoServico);

        /// <summary>
        /// Verifica se existe uma operadora com o nome especificado
        /// </summary>
        /// <param name="nome">Nome da operadora a ser verificado</param>
        /// <returns>True se existir, False caso contrário</returns>
        Task<bool> ExisteComNome(string nome);
    }
}
