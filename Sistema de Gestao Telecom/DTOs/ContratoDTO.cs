using Sistema_de_Gestao_Telecom.Models;

namespace Sistema_de_Gestao_Telecom.DTOs
{
    public class ContratoDTO
    {
        public int Id { get; set; }
        public string NomeFilial { get; set; }
        public int OperadoraId { get; set; }
        public string NomeOperadora { get; set; }
        public string PlanoContratado { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataVencimento { get; set; }
        public decimal ValorMensal { get; set; }
        public StatusContrato Status { get; set; }
    }

    public class CreateContratoDTO
    {
        public string NomeFilial { get; set; }
        public int OperadoraId { get; set; }
        public string PlanoContratado { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataVencimento { get; set; }
        public decimal ValorMensal { get; set; }
        public StatusContrato Status { get; set; }
    }

    public class UpdateContratoDTO
    {
        public string NomeFilial { get; set; }
        public int OperadoraId { get; set; }
        public string PlanoContratado { get; set; }
        public DateTime DataVencimento { get; set; }
        public decimal ValorMensal { get; set; }
        public StatusContrato Status { get; set; }
    }
}
