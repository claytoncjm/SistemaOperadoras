export enum TipoServico {
  TELEFONIA_FIXA = 'Telefonia Fixa',
  TELEFONIA_MOVEL = 'Telefonia Móvel',
  INTERNET = 'Internet',
  TV = 'TV',
  DADOS = 'Dados'
}

export interface Operadora {
  id: number;
  nome: string;
  tipoServico: TipoServico;
  contatoSuporte: string;
  dataCadastro: Date;
  dataAtualizacao: Date;
}

export interface CreateOperadoraDto {
  nome: string;
  tipoServico: TipoServico;
  contatoSuporte: string;
}

export interface UpdateOperadoraDto {
  nome: string;
  tipoServico: TipoServico;
  contatoSuporte: string;
}
