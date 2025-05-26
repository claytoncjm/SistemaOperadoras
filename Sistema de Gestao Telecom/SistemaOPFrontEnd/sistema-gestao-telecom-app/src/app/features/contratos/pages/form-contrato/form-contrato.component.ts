import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { of, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContratoService } from '../../../../core/services/contrato.service';
import { OperadoraService } from '../../../../core/services/operadora.service';
import { Contrato, StatusContrato } from '../../../../core/models/contrato.model';
import { Operadora } from '../../../../core/models/operadora.model';

@Component({
  selector: 'app-form-contrato',
  templateUrl: './form-contrato.component.html',
  styleUrls: ['./form-contrato.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ]
})
export class FormContratoComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  isEdicao = false;
  contratoId: number = 0;
  statusOptions = Object.values(StatusContrato);
  operadoras: Operadora[] = [];
  filteredOperadoras: Observable<Operadora[]> = of([]);

  constructor(
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private operadoraService: OperadoraService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.initForm();
    
    // Carregar lista de operadoras
    this.operadoraService.getAll().subscribe((operadoras: Operadora[]) => {
      this.operadoras = operadoras;
    });

    // Verificar se é edição
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      if (id) {
        this.isEdicao = true;
        this.contratoId = id;
        this.carregarContrato();
      }
    });

    // Configurar o filtro de operadoras
    const operadoraControl = this.form.get('operadoraId');
    if (operadoraControl) {
      this.filteredOperadoras = operadoraControl.valueChanges.pipe(
        startWith(''),
        map((value: string) => this._filterOperadoras(value))
      );
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      operadoraId: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0)]],
      status: ['ATIVO', Validators.required]
    });
  }

  private _filterOperadoras(value: string | number): Operadora[] {
    if (typeof value === 'number') {
      return this.operadoras.filter(op => op.id === value);
    }
    const filterValue = value.toLowerCase();
    return this.operadoras.filter(op => op.nome.toLowerCase().includes(filterValue));
  }

  private criarFormulario(): void {
    this.form = this.fb.group({
      nomeFilial: ['', [Validators.required, Validators.minLength(3)]],
      operadoraId: ['', Validators.required],
      planoContratado: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataVencimento: ['', Validators.required],
      valorMensal: ['', [Validators.required, Validators.min(0)]],
      status: ['', Validators.required]
    });
  }

  private carregarOperadoras(): void {
    this.operadoraService.getAll().subscribe({
      next: (operadoras) => {
        this.operadoras = operadoras;
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

  private carregarContrato(): void {
    this.contratoService.getById(this.contratoId).subscribe({
      next: (contrato) => {
        this.form.patchValue({
          ...contrato,
          dataInicio: new Date(contrato.dataInicio),
          dataVencimento: new Date(contrato.dataVencimento)
        });
      },
      error: (error) => {
        console.error('Erro ao carregar contrato:', error);
        this.snackBar.open('Erro ao carregar contrato', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  displayOperadora(operadora: Operadora): string {
    return operadora ? operadora.nome : '';
  }

  onSubmit(): void {
    if (this.form.valid) {
      const contrato = {
        ...this.form.value,
        dataInicio: this.form.value.dataInicio.toISOString(),
        dataVencimento: this.form.value.dataVencimento.toISOString()
      };
      
      if (this.isEdicao) {
        this.contratoService.update(this.contratoId, contrato).subscribe({
          next: () => {
            this.snackBar.open('Contrato atualizado com sucesso', 'Fechar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            this.router.navigate(['/contratos']);
          },
          error: (error) => {
            console.error('Erro ao atualizar contrato:', error);
            this.snackBar.open('Erro ao atualizar contrato', 'Fechar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          }
        });
      } else {
        this.contratoService.create(contrato).subscribe({
          next: () => {
            this.snackBar.open('Contrato criado com sucesso', 'Fechar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            this.router.navigate(['/contratos']);
          },
          error: (error) => {
            console.error('Erro ao criar contrato:', error);
            this.snackBar.open('Erro ao criar contrato', 'Fechar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          }
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/contratos']);
  }
}
