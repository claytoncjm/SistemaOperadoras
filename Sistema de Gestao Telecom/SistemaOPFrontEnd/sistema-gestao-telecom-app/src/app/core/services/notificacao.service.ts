import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Notificacao } from '../models/notificacao.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  private baseUrl = `${environment.apiUrl}/notificacoes`;
  private notificacoesSubject = new BehaviorSubject<Notificacao[]>([]);
  private notificacoesNaoLidasSubject = new BehaviorSubject<number>(0);

  notificacoes$ = this.notificacoesSubject.asObservable();
  notificacoesNaoLidas$ = this.notificacoesNaoLidasSubject.asObservable();

  constructor(private http: HttpClient) {
    // Atualiza as notificações a cada 5 minutos
    timer(0, 300000).pipe(
      switchMap(() => this.buscarNotificacoes())
    ).subscribe();
  }

  private buscarNotificacoes(): Observable<Notificacao[]> {
    return this.http.get<ApiResponse<Notificacao[]>>(`${this.baseUrl}`).pipe(
      map(response => response.data),
      tap(notificacoes => {
        this.notificacoesSubject.next(notificacoes);
        this.atualizarContadorNaoLidas(notificacoes);
      })
    );
  }

  private atualizarContadorNaoLidas(notificacoes: Notificacao[]): void {
    const naoLidas = notificacoes.filter(n => !n.lida).length;
    this.notificacoesNaoLidasSubject.next(naoLidas);
  }

  marcarComoLida(id: number): Observable<void> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}/lida`, {}).pipe(
      map(response => response.data),
      tap(() => {
        const notificacoes = this.notificacoesSubject.value.map(n => 
          n.id === id ? { ...n, lida: true } : n
        );
        this.notificacoesSubject.next(notificacoes);
        this.atualizarContadorNaoLidas(notificacoes);
      })
    );
  }

  marcarTodasComoLidas(): Observable<void> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/marcar-todas-lidas`, {}).pipe(
      map(response => response.data),
      tap(() => {
        const notificacoes = this.notificacoesSubject.value.map(n => ({ ...n, lida: true }));
        this.notificacoesSubject.next(notificacoes);
        this.notificacoesNaoLidasSubject.next(0);
      })
    );
  }

  excluirNotificacao(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data),
      tap(() => {
        const notificacoes = this.notificacoesSubject.value.filter(n => n.id !== id);
        this.notificacoesSubject.next(notificacoes);
        this.atualizarContadorNaoLidas(notificacoes);
      })
    );
  }

  limparTodasNotificacoes(): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}`).pipe(
      map(response => response.data),
      tap(() => {
        this.notificacoesSubject.next([]);
        this.notificacoesNaoLidasSubject.next(0);
      })
    );
  }
}
