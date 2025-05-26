import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    return this.http.get<ApiResponse<DashboardData>>(this.baseUrl);
  }

  getEvolucaoMensal(ano: number, mes?: number): Observable<ApiResponse<DashboardData['evolucaoMensal']>> {
    let url = `${this.baseUrl}/evolucao/${ano}`;
    if (mes) {
      url += `/${mes}`;
    }
    return this.http.get<ApiResponse<DashboardData['evolucaoMensal']>>(url);
  }

  getDistribuicaoOperadoras(): Observable<ApiResponse<DashboardData['distribuicaoOperadoras']>> {
    return this.http.get<ApiResponse<DashboardData['distribuicaoOperadoras']>>(`${this.baseUrl}/distribuicao-operadoras`);
  }

  getFaturasStatus(): Observable<ApiResponse<DashboardData['faturasStatus']>> {
    return this.http.get<ApiResponse<DashboardData['faturasStatus']>>(`${this.baseUrl}/faturas-status`);
  }
}
