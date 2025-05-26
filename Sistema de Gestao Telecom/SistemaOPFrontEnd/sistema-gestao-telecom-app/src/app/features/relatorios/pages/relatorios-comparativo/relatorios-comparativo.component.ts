import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RelatorioService, RelatorioComparativo } from '../../../../core/services/relatorio.service';

@Component({
  selector: 'app-relatorios-comparativo',
  templateUrl: './relatorios-comparativo.component.html',
  styleUrls: ['./relatorios-comparativo.component.scss']
})
export class RelatoriosComparativoComponent implements OnInit {
  form: FormGroup;
  displayedColumns: string[] = [
    'operadora',
    'quantidadeContratos',
    'valorTotalContratos',
    'mediaValorContrato',
    'quantidadeFaturas',
    'valorTotalFaturas',
    'mediaValorFatura',
    'percentualVariacao',
    'acoes'
  ];
  dataSource: MatTableDataSource<RelatorioComparativo>;
  isLoading = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private relatorioService: RelatorioService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<RelatorioComparativo>();
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

      this.relatorioService.getComparativo(dataInicio, dataFim).subscribe({
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
      this.relatorioService.exportarPDF('comparativo', this.dataSource.data).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'relatorio-comparativo.pdf';
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
      this.relatorioService.exportarExcel('comparativo', this.dataSource.data).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'relatorio-comparativo.xlsx';
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
