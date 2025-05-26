using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sistema_de_Gestao_Telecom.Models
{
    public class Contrato
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string NomeFilial { get; set; }

        [Required]
        public int OperadoraId { get; set; }

        [ForeignKey("OperadoraId")]
        public Operadora Operadora { get; set; }

        [Required]
        [StringLength(100)]
        public string PlanoContratado { get; set; }

        [Required]
        public DateTime DataInicio { get; set; }

        [Required]
        public DateTime DataVencimento { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorMensal { get; set; }

        [Required]
        public StatusContrato Status { get; set; }

        // Navegação
        public ICollection<Fatura> Faturas { get; set; }
    }

    public enum StatusContrato
    {
        Ativo,
        Inativo
    }
}
