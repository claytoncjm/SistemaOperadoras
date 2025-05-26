import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { Fatura } from '../../../../core/models/fatura.model';
import { FaturaService } from '../../../../core/services/fatura.service';
import { NotificacaoService } from '../../../../core/services/notificacao.service';

@Component({
  selector: 'app-lista-faturas',
  templateUrl: './lista-faturas.component.html',
  styleUrls: ['./lista-faturas.component.scss']
})
export class ListaFaturasComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'nomeFilial',
    'nomeOperadora',
    'dataEmissao',
    'dataVencimento',
    'valorCobrado',
    'status',
    'acoes'
  ];
  dataSource: MatTableDataSource<Fatura>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private checkInterval: Subscription;

  constructor(
    private faturaService: FaturaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private notificacaoService: NotificacaoService
  ) {
    this.dataSource = new MatTableDataSource<Fatura>();
  }

  ngOnInit(): void {
    this.carregarFaturas();
    this.iniciarVerificacaoFaturas();
  }

  ngOnDestroy(): void {
    if (this.checkInterval) {
      this.checkInterval.unsubscribe();
    }
  }

  private iniciarVerificacaoFaturas(): void {
    // Verifica imediatamente ao iniciar
    this.verificarFaturas();

    // Configura verificação periódica a cada hora
    this.checkInterval = interval(3600000).subscribe(() => {
      this.verificarFaturas();
    });
  }

  private verificarFaturas(): void {
    const hoje = new Date();
    const diasParaVencimento = 5; // Notificar 5 dias antes do vencimento

    this.faturaService.getAll().subscribe(faturas => {
      faturas.forEach(fatura => {
        const dataVencimento = new Date(fatura.dataVencimento);
        const diasRestantes = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24));

        // Verifica faturas vencidas
        if (diasRestantes < 0 && fatura.status !== 'PAGA') {
          this.notificacaoService.criarNotificacao({
            titulo: 'Fatura Vencida',
            mensagem: `A fatura ${fatura.id} da operadora ${fatura.nomeOperadora} está vencida há ${Math.abs(diasRestantes)} dias.`,
            tipo: 'FATURA_VENCIDA',
            dadosRelacionados: {
              tipo: 'FATURA',
              id: fatura.id
            }
          });
        }
        // Verifica faturas próximas do vencimento
        else if (diasRestantes <= diasParaVencimento && diasRestantes >= 0 && fatura.status !== 'PAGA') {
          this.notificacaoService.criarNotificacao({
            titulo: 'Vencimento Próximo',
            mensagem: `A fatura ${fatura.id} da operadora ${fatura.nomeOperadora} vence em ${diasRestantes} dias.`,
            tipo: 'FATURA_PROXIMA_VENCIMENTO',
            dadosRelacionados: {
              tipo: 'FATURA',
              id: fatura.id
            }
          });
        }
      });
    });
  }

  carregarFaturas(): void {
    this.faturaService.getAll().subscribe({
      next: (faturas) => {
        this.dataSource.data = faturas;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error('Erro ao carregar faturas:', error);
        this.snackBar.open('Erro ao carregar faturas', 'Fechar', {
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

  editarFatura(id: number): void {
    this.router.navigate(['/faturas/editar', id]);
  }

  excluirFatura(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta fatura?')) {
      this.faturaService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Fatura excluída com sucesso', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.carregarFaturas();
        },
        error: (error) => {
          console.error('Erro ao excluir fatura:', error);
          this.snackBar.open('Erro ao excluir fatura', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  novaFatura(): void {
    this.router.navigate(['/faturas/novo']);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}
