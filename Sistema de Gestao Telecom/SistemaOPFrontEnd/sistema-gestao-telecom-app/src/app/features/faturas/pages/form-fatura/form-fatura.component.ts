import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Fatura, StatusFatura } from '../../../../core/models/fatura.model';
import { Contrato } from '../../../../core/models/contrato.model';
import { FaturaService } from '../../../../core/services/fatura.service';
import { ContratoService } from '../../../../core/services/contrato.service';

@Component({
  selector: 'app-form-fatura',
  templateUrl: './form-fatura.component.html',
  styleUrls: ['./form-fatura.component.scss']
})
export class FormFaturaComponent implements OnInit {
  form: FormGroup;
  isEdicao = false;
  faturaId: number;
  statusOptions = Object.values(StatusFatura);
  contratos: Contrato[] = [];
  filteredContratos: Observable<Contrato[]>;

  constructor(
    private fb: FormBuilder,
    private faturaService: FaturaService,
    private contratoService: ContratoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.criarFormulario();
  }

  ngOnInit(): void {
    this.carregarContratos();
    
    this.faturaId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.faturaId) {
      this.isEdicao = true;
      this.carregarFatura();
    }

    // Configurar o filtro de contratos
    this.filteredContratos = this.form.get('contratoId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterContratos(value))
    );
  }

  private _filterContratos(value: string | number): Contrato[] {
    if (typeof value === 'number') {
      return this.contratos.filter(c => c.id === value);
    }
    const filterValue = value.toLowerCase();
    return this.contratos.filter(c => 
      c.nomeFilial.toLowerCase().includes(filterValue) ||
      c.nomeOperadora?.toLowerCase().includes(filterValue)
    );
  }

  private criarFormulario(): void {
    this.form = this.fb.group({
      contratoId: ['', Validators.required],
      dataEmissao: ['', Validators.required],
      dataVencimento: ['', Validators.required],
      valorCobrado: ['', [Validators.required, Validators.min(0)]],
      status: ['', Validators.required]
    });
  }

  private carregarContratos(): void {
    this.contratoService.getAll().subscribe({
      next: (contratos) => {
        this.contratos = contratos;
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

  private carregarFatura(): void {
    this.faturaService.getById(this.faturaId).subscribe({
      next: (fatura) => {
        this.form.patchValue({
          ...fatura,
          dataEmissao: new Date(fatura.dataEmissao),
          dataVencimento: new Date(fatura.dataVencimento)
        });
      },
      error: (error) => {
        console.error('Erro ao carregar fatura:', error);
        this.snackBar.open('Erro ao carregar fatura', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  displayContrato(contrato: Contrato): string {
    return contrato ? `${contrato.nomeFilial} - ${contrato.nomeOperadora}` : '';
  }

  onSubmit(): void {
    if (this.form.valid) {
      const fatura = {
        ...this.form.value,
        dataEmissao: this.form.value.dataEmissao.toISOString(),
        dataVencimento: this.form.value.dataVencimento.toISOString()
      };
      
      if (this.isEdicao) {
        this.faturaService.update(this.faturaId, fatura).subscribe({
          next: () => {
            this.snackBar.open('Fatura atualizada com sucesso', 'Fechar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            this.router.navigate(['/faturas']);
          },
          error: (error) => {
            console.error('Erro ao atualizar fatura:', error);
            this.snackBar.open('Erro ao atualizar fatura', 'Fechar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          }
        });
      } else {
        this.faturaService.create(fatura).subscribe({
          next: () => {
            this.snackBar.open('Fatura criada com sucesso', 'Fechar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            this.router.navigate(['/faturas']);
          },
          error: (error) => {
            console.error('Erro ao criar fatura:', error);
            this.snackBar.open('Erro ao criar fatura', 'Fechar', {
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
    this.router.navigate(['/faturas']);
  }
}
