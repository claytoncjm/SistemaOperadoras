import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MaterialModule } from './shared/material.module';
import { NotificacaoService } from './core/services/notificacao.service';
import { NotificacoesComponent } from './shared/components/notificacoes/notificacoes.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    AsyncPipe,
    NotificacoesComponent
  ]
})
export class AppComponent {
  isHandset$: Observable<boolean>;
  notificacoesNaoLidas$: Observable<number>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private notificacaoService: NotificacaoService
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );

    this.notificacoesNaoLidas$ = this.notificacaoService.notificacoesNaoLidas$;
  }
}
