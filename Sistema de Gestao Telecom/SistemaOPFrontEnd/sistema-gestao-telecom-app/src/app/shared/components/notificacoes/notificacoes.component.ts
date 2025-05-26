import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { Notificacao, TipoNotificacao } from '../../../core/models/notificacao.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.component.html',
  styleUrls: ['./notificacoes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    DatePipe
  ]
})
export class NotificacoesComponent implements OnInit {
  notificacoes$: Observable<Notificacao[]>;
  notificacoesNaoLidas$: Observable<number>;

  constructor(
    private notificacaoService: NotificacaoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.notificacoes$ = this.notificacaoService.notificacoes$;
    this.notificacoesNaoLidas$ = this.notificacaoService.notificacoesNaoLidas$;
  }

  ngOnInit(): void { }

  getIconePorTipo(tipo: TipoNotificacao): string {
    switch (tipo) {
      case TipoNotificacao.VENCIMENTO_PROXIMO:
        return 'alarm';
      case TipoNotificacao.FATURA_VENCIDA:
        return 'warning';
      case TipoNotificacao.CONTRATO_PROXIMO_RENOVACAO:
        return 'update';
      case TipoNotificacao.CONTRATO_VENCIDO:
        return 'error';
      case TipoNotificacao.SISTEMA:
        return 'info';
      default:
        return 'notifications';
    }
  }

  getCorPorTipo(tipo: TipoNotificacao): string {
    switch (tipo) {
      case TipoNotificacao.VENCIMENTO_PROXIMO:
        return 'accent';
      case TipoNotificacao.FATURA_VENCIDA:
        return 'warn';
      case TipoNotificacao.CONTRATO_PROXIMO_RENOVACAO:
        return 'primary';
      case TipoNotificacao.CONTRATO_VENCIDO:
        return 'warn';
      case TipoNotificacao.SISTEMA:
        return '';
      default:
        return '';
    }
  }

  marcarComoLida(notificacao: Notificacao, event: Event): void {
    event.stopPropagation();
    this.notificacaoService.marcarComoLida(notificacao.id).subscribe();
  }

  marcarTodasComoLidas(): void {
    this.notificacaoService.marcarTodasComoLidas().subscribe(() => {
      this.snackBar.open('Todas as notificações foram marcadas como lidas', 'Fechar', {
        duration: 3000
      });
    });
  }

  excluirNotificacao(notificacao: Notificacao, event: Event): void {
    event.stopPropagation();
    this.notificacaoService.excluirNotificacao(notificacao.id).subscribe(() => {
      this.snackBar.open('Notificação excluída', 'Fechar', {
        duration: 3000
      });
    });
  }

  limparTodasNotificacoes(): void {
    this.notificacaoService.limparTodasNotificacoes().subscribe(() => {
      this.snackBar.open('Todas as notificações foram excluídas', 'Fechar', {
        duration: 3000
      });
    });
  }

  navegarParaDetalhes(notificacao: Notificacao): void {
    if (!notificacao.dadosRelacionados) return;

    if (notificacao.dadosRelacionados.faturaId) {
      this.router.navigate(['/faturas', notificacao.dadosRelacionados.faturaId]);
    } else if (notificacao.dadosRelacionados.contratoId) {
      this.router.navigate(['/contratos', notificacao.dadosRelacionados.contratoId]);
    } else if (notificacao.dadosRelacionados.operadoraId) {
      this.router.navigate(['/operadoras', notificacao.dadosRelacionados.operadoraId]);
    }
  }
}
