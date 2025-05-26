import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

export interface DashboardData {
  totais: {
    operadoras: number;
    contratos: number;
    faturas: number;
    valorTotalFaturas: number;
  };
  faturasStatus: {
    status: string;
    quantidade: number;
  }[];
  evolucaoMensal: {
    mes: string;
    faturasEmitidas: number;
    faturasPagas: number;
    valorTotal: number;
  }[];
  distribuicaoOperadoras: {
    operadora: string;
    quantidade: number;
    valorTotal: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = `${environment.apiUrl}${environment.endpoints.dashboard}`;

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<ApiResponse<DashboardData>> {
    return this.http.get<ApiResponse<DashboardData>>(this.baseUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao carregar dados do dashboard:', error);
        return of({ success: false, message: this.getErrorMessage(error), data: this.getEmptyDashboardData() });
      })
    );
  }

  getEvolucaoMensal(ano: number, mes?: number): Observable<ApiResponse<DashboardData['evolucaoMensal']>> {
    let url = `${this.baseUrl}/evolucao/${ano}`;
    if (mes) {
      url += `/${mes}`;
    }
    return this.http.get<ApiResponse<DashboardData['evolucaoMensal']>>(url);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Não foi possível conectar ao servidor. Por favor, verifique sua conexão.';
    }
    return error.error?.message || error.message || 'Ocorreu um erro ao processar sua requisição.';
  }

  private getEmptyDashboardData(): DashboardData {
    return {
      totais: { operadoras: 0, contratos: 0, faturas: 0, valorTotalFaturas: 0 },
      faturasStatus: [],
      evolucaoMensal: [],
      distribuicaoOperadoras: []
    };
  }

  getDistribuicaoOperadoras(): Observable<ApiResponse<DashboardData['distribuicaoOperadoras']>> {
    return this.http.get<ApiResponse<DashboardData['distribuicaoOperadoras']>>(`${this.baseUrl}/distribuicao-operadoras`);
  }

  getFaturasStatus(): Observable<ApiResponse<DashboardData['faturasStatus']>> {
    return this.http.get<ApiResponse<DashboardData['faturasStatus']>>(`${this.baseUrl}/faturas-status`);
  }
}
