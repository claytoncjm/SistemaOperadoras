using Sistema_de_Gestao_Telecom.Models;

namespace Sistema_de_Gestao_Telecom.Interfaces
{
    public interface IContratoRepository : IRepository<Contrato>
    {
        /// <summary>
        /// Busca contratos por operadora
        /// </summary>
        /// <param name="operadoraId">ID da operadora</param>
        /// <returns>Lista de contratos da operadora</returns>
        Task<IEnumerable<Contrato>> GetPorOperadora(int operadoraId);

        /// <summary>
        /// Busca contratos próximos do vencimento
        /// </summary>
        /// <param name="diasParaVencimento">Número de dias até o vencimento</param>
        /// <returns>Lista de contratos próximos do vencimento</returns>
        Task<IEnumerable<Contrato>> GetVencendo(int diasParaVencimento);

        /// <summary>
        /// Busca contratos por filial
        /// </summary>
        /// <param name="nomeFilial">Nome da filial</param>
        /// <returns>Lista de contratos da filial</returns>
        Task<IEnumerable<Contrato>> GetPorFilial(string nomeFilial);

        /// <summary>
        /// Calcula o valor total dos contratos ativos
        /// </summary>
        /// <returns>Soma dos valores mensais dos contratos ativos</returns>
        Task<decimal> GetValorTotalAtivos();
    }
}
