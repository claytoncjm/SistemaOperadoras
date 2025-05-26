import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';
import { Contrato, StatusContrato } from '../../../../core/models/contrato.model';
import { ContratoService } from '../../../../core/services/contrato.service';
import { NotificacaoService } from '../../../../core/services/notificacao.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-lista-contratos',
  templateUrl: './lista-contratos.component.html',
  styleUrls: ['./lista-contratos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class ListaContratosComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'nomeFilial',
    'nomeOperadora',
    'planoContratado',
    'dataInicio',
    'dataVencimento',
    'valorMensal',
    'status',
    'acoes'
  ];
  dataSource: MatTableDataSource<Contrato>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private checkInterval: Subscription | undefined;
  private baseUrl: string;

  constructor(
    private contratoService: ContratoService,
    private notificacaoService: NotificacaoService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.baseUrl = environment.apiUrl;
    this.dataSource = new MatTableDataSource<Contrato>();
  }

  ngOnInit(): void {
    this.carregarContratos();
    this.iniciarVerificacaoContratos();
  }

  private iniciarVerificacaoContratos(): void {
    this.verificarVencimentoContratos();
    this.checkInterval = interval(3600000).subscribe(() => {
      this.verificarVencimentoContratos();
    });
  }

  ngOnDestroy(): void {
    if (this.checkInterval) {
      this.checkInterval.unsubscribe();
    }
  }

  private verificarVencimentoContratos(): void {
    this.dataSource.data.forEach(contrato => {
      const dataVencimento = new Date(contrato.dataVencimento);
      const hoje = new Date();
      const diasRestantes = Math.floor((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

      if (contrato.status === StatusContrato.Ativo && diasRestantes <= 0) {
        const notificacao = {
          titulo: 'Contrato Vencido',
          mensagem: `O contrato #${contrato.id} com a operadora ${contrato.nomeOperadora} está vencido.`,
          tipo: 'CONTRATO_VENCIDO',
          dadosRelacionados: { contratoId: contrato.id },
          lida: false
        };
        // Enviar notificação para o backend
        this.http.post(`${this.baseUrl}/notificacoes`, notificacao).subscribe();
      } else if (contrato.status === StatusContrato.Ativo && diasRestantes <= 30) {
        const notificacao = {
          titulo: 'Contrato Próximo do Vencimento',
          mensagem: `O contrato #${contrato.id} com a operadora ${contrato.nomeOperadora} vence em ${diasRestantes} dias.`,
          tipo: 'CONTRATO_PROXIMO_VENCIMENTO',
          dadosRelacionados: { contratoId: contrato.id },
          lida: false
        };
        // Enviar notificação para o backend
        this.http.post(`${this.baseUrl}/notificacoes`, notificacao).subscribe();
      }
    });
  }

  carregarContratos(): void {
    this.contratoService.getAll().subscribe({
      next: (contratos) => {
        this.dataSource.data = contratos;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error('Erro ao carregar contratos:', error);
        this.snackBar.open('Erro ao carregar contratos', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editarContrato(id: number): void {
    this.router.navigate(['/contratos/editar', id]);
  }

  excluirContrato(id: number): void {
    if (confirm('Tem certeza que deseja excluir este contrato?')) {
      this.contratoService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Contrato excluído com sucesso', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.carregarContratos();
        },
        error: (error) => {
          console.error('Erro ao excluir contrato:', error);
          this.snackBar.open('Erro ao excluir contrato', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  novoContrato(): void {
    this.router.navigate(['/contratos/novo']);
  }
}
