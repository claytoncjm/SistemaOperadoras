using Sistema_de_Gestao_Telecom.Models;

namespace Sistema_de_Gestao_Telecom.DTOs
{
    public class OperadoraDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public TipoServico TipoServico { get; set; }
        public string ContatoSuporte { get; set; }
    }

    public class CreateOperadoraDTO
    {
        public string Nome { get; set; }
        public TipoServico TipoServico { get; set; }
        public string ContatoSuporte { get; set; }
    }

    public class UpdateOperadoraDTO
    {
        public string Nome { get; set; }
        public TipoServico TipoServico { get; set; }
        public string ContatoSuporte { get; set; }
    }
}
