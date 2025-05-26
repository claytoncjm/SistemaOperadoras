import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operadora, TipoServico } from '../models/operadora.model';

interface CreateOperadoraDto {
  nome: string;
  tipoServico: string;
  contatoSuporte: string;
}

interface UpdateOperadoraDto extends CreateOperadoraDto {}

@Injectable({
  providedIn: 'root'
})
export class OperadoraService {
  private apiUrl = 'http://localhost:5000/api/operadoras';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Operadora[]> {
    return this.http.get<Operadora[]>(this.apiUrl);
  }

  getById(id: number): Observable<Operadora> {
    return this.http.get<Operadora>(`${this.apiUrl}/${id}`);
  }

  create(operadora: Partial<Operadora>): Observable<Operadora> {
    return this.http.post<Operadora>(this.apiUrl, operadora);
  }

  update(id: number, operadora: Partial<Operadora>): Observable<Operadora> {
    return this.http.put<Operadora>(`${this.apiUrl}/${id}`, operadora);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByTipoServico(tipo: TipoServico): Observable<Operadora[]> {
    return this.http.get<Operadora[]>(`${this.apiUrl}/tipo/${tipo}`);
  }
}
