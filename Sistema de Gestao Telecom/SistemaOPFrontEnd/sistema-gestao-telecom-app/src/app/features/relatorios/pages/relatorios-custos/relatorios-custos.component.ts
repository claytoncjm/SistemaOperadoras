import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RelatorioService, RelatorioCustos } from '../../../../core/services/relatorio.service';

@Component({
  selector: 'app-relatorios-custos',
  templateUrl: './relatorios-custos.component.html',
  styleUrls: ['./relatorios-custos.component.scss']
})
export class RelatoriosCustosComponent implements OnInit {
  form: FormGroup;
  displayedColumns: string[] = [
    'operadora',
    'totalFaturas',
    'valorTotal',
    'mediaValor',
    'maiorValor',
    'menorValor',
    'periodo',
    'acoes'
  ];
  dataSource: MatTableDataSource<RelatorioCustos>;
  isLoading = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private relatorioService: RelatorioService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<RelatorioCustos>();
    this.criarFormulario();
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private criarFormulario(): void {
    this.form = this.fb.group({
      dataInicio: [''],
      dataFim: ['']
    });
  }

  gerarRelatorio(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const { dataInicio, dataFim } = this.form.value;

      this.relatorioService.getCustosPorOperadora(dataInicio, dataFim).subscribe({
        next: (response) => {
          this.dataSource.data = response.data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao gerar relatório:', error);
          this.snackBar.open('Erro ao gerar relatório', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.isLoading = false;
        }
      });
    }
  }

  exportarPDF(): void {
    if (this.dataSource.data.length > 0) {
      this.relatorioService.exportarPDF('custos', this.dataSource.data).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'relatorio-custos.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Erro ao exportar PDF:', error);
          this.snackBar.open('Erro ao exportar PDF', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  exportarExcel(): void {
    if (this.dataSource.data.length > 0) {
      this.relatorioService.exportarExcel('custos', this.dataSource.data).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'relatorio-custos.xlsx';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Erro ao exportar Excel:', error);
          this.snackBar.open('Erro ao exportar Excel', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
