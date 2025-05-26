using Sistema_de_Gestao_Telecom.Models;

namespace Sistema_de_Gestao_Telecom.DTOs
{
    public class FaturaDTO
    {
        public int Id { get; set; }
        public int ContratoId { get; set; }
        public string NomeFilial { get; set; }
        public string NomeOperadora { get; set; }
        public DateTime DataEmissao { get; set; }
        public DateTime DataVencimento { get; set; }
        public decimal ValorCobrado { get; set; }
        public StatusFatura Status { get; set; }
    }

    public class CreateFaturaDTO
    {
        public int ContratoId { get; set; }
        public DateTime DataEmissao { get; set; }
        public DateTime DataVencimento { get; set; }
        public decimal ValorCobrado { get; set; }
        public StatusFatura Status { get; set; }
    }

    public class UpdateFaturaDTO
    {
        public DateTime DataVencimento { get; set; }
        public decimal ValorCobrado { get; set; }
        public StatusFatura Status { get; set; }
    }
}
