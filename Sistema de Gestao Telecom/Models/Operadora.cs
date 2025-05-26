using System.ComponentModel.DataAnnotations;

namespace Sistema_de_Gestao_Telecom.Models
{
    public class Operadora
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Nome { get; set; }

        [Required]
        public TipoServico TipoServico { get; set; }

        [Required]
        [StringLength(100)]
        public string ContatoSuporte { get; set; }

        // Navegação
        public ICollection<Contrato> Contratos { get; set; }
    }

    public enum TipoServico
    {
        Movel,
        Fixo,
        Internet
    }
}
