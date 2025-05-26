export enum StatusContrato {
  Ativo = 'Ativo',
  Cancelado = 'Cancelado',
  Suspenso = 'Suspenso'
}

export interface Contrato {
  id?: number;
  nomeFilial: string;
  operadoraId: number;
  nomeOperadora?: string;
  planoContratado: string;
  dataInicio: Date;
  dataVencimento: Date;
  valorMensal: number;
  status: StatusContrato;
}

export interface CreateContratoDto {
  nomeFilial: string;
  operadoraId: number;
  planoContratado: string;
  dataInicio: Date;
  dataVencimento: Date;
  valorMensal: number;
  status: StatusContrato;
}

export interface UpdateContratoDto {
  nomeFilial: string;
  operadoraId: number;
  planoContratado: string;
  dataVencimento: Date;
  valorMensal: number;
  status: StatusContrato;
}
