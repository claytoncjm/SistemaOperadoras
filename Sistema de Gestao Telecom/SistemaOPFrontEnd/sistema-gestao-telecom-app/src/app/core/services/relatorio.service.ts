import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export interface RelatorioCustos {
  operadora: string;
  totalFaturas: number;
  valorTotal: number;
  mediaValor: number;
  maiorValor: number;
  menorValor: number;
  periodo: string;
}

export interface RelatorioVencimentos {
  tipo: 'FATURA' | 'CONTRATO';
  id: number;
  operadora: string;
  valor: number;
  dataVencimento: Date;
  diasParaVencimento: number;
  status: string;
}

export interface RelatorioComparativo {
  operadora: string;
  quantidadeContratos: number;
  valorTotalContratos: number;
  mediaValorContrato: number;
  quantidadeFaturas: number;
  valorTotalFaturas: number;
  mediaValorFatura: number;
  percentualVariacao: number;
}

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  private baseUrl = `${environment.apiUrl}${environment.endpoints.relatorios}`;

  constructor(private http: HttpClient) { }

  getCustosPorOperadora(dataInicio: Date, dataFim: Date): Observable<ApiResponse<RelatorioCustos[]>> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio.toISOString())
      .set('dataFim', dataFim.toISOString());

    return this.http.get<ApiResponse<RelatorioCustos[]>>(`${this.baseUrl}/custos`, { params });
  }

  getVencimentos(tipo: 'FATURA' | 'CONTRATO' | 'TODOS', diasFuturos: number): Observable<ApiResponse<RelatorioVencimentos[]>> {
    const params = new HttpParams()
      .set('tipo', tipo)
      .set('diasFuturos', diasFuturos.toString());

    return this.http.get<ApiResponse<RelatorioVencimentos[]>>(`${this.baseUrl}/vencimentos`, { params });
  }

  getComparativo(dataInicio: Date, dataFim: Date): Observable<ApiResponse<RelatorioComparativo[]>> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio.toISOString())
      .set('dataFim', dataFim.toISOString());

    return this.http.get<ApiResponse<RelatorioComparativo[]>>(`${this.baseUrl}/comparativo`, { params });
  }

  exportarPDF(tipo: string, dados: any): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/exportar/pdf/${tipo}`, dados, {
      responseType: 'blob'
    });
  }

  exportarExcel(tipo: string, dados: any): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/exportar/excel/${tipo}`, dados, {
      responseType: 'blob'
    });
  }
}
