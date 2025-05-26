using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sistema_de_Gestao_Telecom.Models
{
    public class Fatura
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ContratoId { get; set; }

        [ForeignKey("ContratoId")]
        public Contrato Contrato { get; set; }

        [Required]
        public DateTime DataEmissao { get; set; }

        [Required]
        public DateTime DataVencimento { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorCobrado { get; set; }

        [Required]
        public StatusFatura Status { get; set; }
    }

    public enum StatusFatura
    {
        Paga,
        Pendente,
        Atrasada
    }
}
