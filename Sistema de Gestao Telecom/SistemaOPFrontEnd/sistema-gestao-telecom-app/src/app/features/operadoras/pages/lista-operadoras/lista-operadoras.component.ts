import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Operadora } from '../../../../core/models/operadora.model';
import { OperadoraService } from '../../../../core/services/operadora.service';

@Component({
  selector: 'app-lista-operadoras',
  templateUrl: './lista-operadoras.component.html',
  styleUrls: ['./lista-operadoras.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginator,
    MatSort,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class ListaOperadorasComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'tipoServico', 'contatoSuporte', 'acoes'];
  dataSource: MatTableDataSource<Operadora>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private operadoraService: OperadoraService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<Operadora>();
  }

  ngOnInit(): void {
    this.carregarOperadoras();
  }

  carregarOperadoras(): void {
    this.operadoraService.getAll().subscribe({
      next: (operadoras) => {
        this.dataSource.data = operadoras;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error('Erro ao carregar operadoras:', error);
        this.snackBar.open('Erro ao carregar operadoras', 'Fechar', {
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

  editarOperadora(id: number): void {
    this.router.navigate(['/operadoras/editar', id]);
  }

  excluirOperadora(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta operadora?')) {
      this.operadoraService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Operadora excluída com sucesso', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.carregarOperadoras();
        },
        error: (error) => {
          console.error('Erro ao excluir operadora:', error);
          this.snackBar.open('Erro ao excluir operadora', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  novaOperadora(): void {
    this.router.navigate(['/operadoras/novo']);
  }
}
