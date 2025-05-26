import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contrato, CreateContratoDto, UpdateContratoDto } from '../models/contrato.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {
  private apiUrl = `${environment.apiUrl}/contratos`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(this.apiUrl);
  }

  getById(id: number): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.apiUrl}/${id}`);
  }

  create(contrato: CreateContratoDto): Observable<Contrato> {
    return this.http.post<Contrato>(this.apiUrl, contrato);
  }

  update(id: number, contrato: UpdateContratoDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, contrato);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByOperadora(operadoraId: number): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.apiUrl}/operadora/${operadoraId}`);
  }

  getByFilial(nomeFilial: string): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.apiUrl}/filial/${nomeFilial}`);
  }

  getVencendo(dias: number): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.apiUrl}/vencendo/${dias}`);
  }

  getValorTotalAtivos(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/valor-total-ativos`);
  }
}
