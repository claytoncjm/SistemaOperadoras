export interface Notificacao {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: TipoNotificacao;
  dataNotificacao: Date;
  lida: boolean;
  dadosRelacionados?: {
    faturaId?: number;
    contratoId?: number;
    operadoraId?: number;
  };
}

export enum TipoNotificacao {
  VENCIMENTO_PROXIMO = 'VENCIMENTO_PROXIMO',
  FATURA_VENCIDA = 'FATURA_VENCIDA',
  CONTRATO_PROXIMO_RENOVACAO = 'CONTRATO_PROXIMO_RENOVACAO',
  CONTRATO_VENCIDO = 'CONTRATO_VENCIDO',
  SISTEMA = 'SISTEMA'
}
