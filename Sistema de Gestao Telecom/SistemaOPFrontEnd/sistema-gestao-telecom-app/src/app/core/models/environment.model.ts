export interface Environment {
  production: boolean;
  apiUrl: string;
  endpoints: {
    operadoras: string;
    contratos: string;
    faturas: string;
    dashboard: string;
  };
}
