using Sistema_de_Gestao_Telecom.Models;

namespace Sistema_de_Gestao_Telecom.Interfaces
{
    public interface IFaturaRepository : IRepository<Fatura>
    {
        /// <summary>
        /// Busca faturas por contrato
        /// </summary>
        /// <param name="contratoId">ID do contrato</param>
        /// <returns>Lista de faturas do contrato</returns>
        Task<IEnumerable<Fatura>> GetPorContrato(int contratoId);

        /// <summary>
        /// Busca faturas por status
        /// </summary>
        /// <param name="status">Status desejado</param>
        /// <returns>Lista de faturas com o status especificado</returns>
        Task<IEnumerable<Fatura>> GetPorStatus(StatusFatura status);

        /// <summary>
        /// Calcula o valor total das faturas em um período
        /// </summary>
        /// <param name="inicio">Data inicial do período</param>
        /// <param name="fim">Data final do período</param>
        /// <returns>Soma dos valores das faturas no período</returns>
        Task<decimal> GetValorTotalPeriodo(DateTime inicio, DateTime fim);

        /// <summary>
        /// Obtém a distribuição de faturas por status
        /// </summary>
        /// <returns>Dicionário com a quantidade de faturas por status</returns>
        Task<IDictionary<StatusFatura, int>> GetDistribuicaoPorStatus();

        /// <summary>
        /// Busca faturas vencidas
        /// </summary>
        /// <returns>Lista de faturas vencidas</returns>
        Task<IEnumerable<Fatura>> GetVencidas();
    }
}
