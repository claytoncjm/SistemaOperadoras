import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fatura, CreateFaturaDto, UpdateFaturaDto, StatusFatura } from '../models/fatura.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FaturaService {
  private apiUrl = `${environment.apiUrl}/faturas`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Fatura[]> {
    return this.http.get<Fatura[]>(this.apiUrl);
  }

  getById(id: number): Observable<Fatura> {
    return this.http.get<Fatura>(`${this.apiUrl}/${id}`);
  }

  create(fatura: CreateFaturaDto): Observable<Fatura> {
    return this.http.post<Fatura>(this.apiUrl, fatura);
  }

  update(id: number, fatura: UpdateFaturaDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, fatura);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByContrato(contratoId: number): Observable<Fatura[]> {
    return this.http.get<Fatura[]>(`${this.apiUrl}/contrato/${contratoId}`);
  }

  getByStatus(status: StatusFatura): Observable<Fatura[]> {
    return this.http.get<Fatura[]>(`${this.apiUrl}/status/${status}`);
  }

  getVencidas(): Observable<Fatura[]> {
    return this.http.get<Fatura[]>(`${this.apiUrl}/vencidas`);
  }

  getValorTotalPeriodo(inicio: Date, fim: Date): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/valor-total`, {
      params: {
        inicio: inicio.toISOString(),
        fim: fim.toISOString()
      }
    });
  }

  getDistribuicaoStatus(): Observable<Record<StatusFatura, number>> {
    return this.http.get<Record<StatusFatura, number>>(`${this.apiUrl}/distribuicao-status`);
  }
}
