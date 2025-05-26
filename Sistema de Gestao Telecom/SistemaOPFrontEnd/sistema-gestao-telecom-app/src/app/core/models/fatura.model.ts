export enum StatusFatura {
  Pendente = 'Pendente',
  Paga = 'Paga',
  Atrasada = 'Atrasada',
  Cancelada = 'Cancelada'
}

export interface Fatura {
  id?: number;
  contratoId: number;
  nomeFilial?: string;
  nomeOperadora?: string;
  dataEmissao: Date;
  dataVencimento: Date;
  valorCobrado: number;
  status: StatusFatura;
}

export interface CreateFaturaDto {
  contratoId: number;
  dataEmissao: Date;
  dataVencimento: Date;
  valorCobrado: number;
  status: StatusFatura;
}

export interface UpdateFaturaDto {
  dataVencimento: Date;
  valorCobrado: number;
  status: StatusFatura;
}
