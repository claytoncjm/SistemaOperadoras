import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { OperadoraService } from '../../../../core/services/operadora.service';
import { Operadora, TipoServico } from '../../../../core/models/operadora.model';

interface OperadoraFormGroup {
  nome: FormControl<string>;
  tipoServico: FormControl<TipoServico>;
  contatoSuporte: FormControl<string>;
}

type CreateOperadoraDto = Pick<Operadora, 'nome' | 'tipoServico' | 'contatoSuporte'>;

@Component({
  selector: 'app-form-operadora',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './form-operadora.component.html',
  styleUrls: ['./form-operadora.component.scss']
})
export class FormOperadoraComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly operadoraService = inject(OperadoraService);
  private readonly snackBar = inject(MatSnackBar);

  protected form = this.fb.group<OperadoraFormGroup>({
    nome: this.fb.control('', [Validators.required, Validators.minLength(3)]),
    tipoServico: this.fb.control<TipoServico>(TipoServico.TELEFONIA_FIXA, [Validators.required]),
    contatoSuporte: this.fb.control('', [Validators.required, Validators.pattern('^[0-9]{10,11}$')])
  });
  
  protected isEdicao = false;
  protected operadoraId: number | null = null;
  protected readonly tiposServico = Object.values(TipoServico);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdicao = true;
      this.operadoraId = +id;
      this.carregarOperadora();
    }
  }

  private carregarOperadora(): void {
    if (!this.operadoraId) return;

    this.operadoraService.getById(this.operadoraId).subscribe({
      next: (operadora: Operadora) => {
        this.form.patchValue({
          nome: operadora.nome,
          tipoServico: operadora.tipoServico,
          contatoSuporte: operadora.contatoSuporte
        });
      },
      error: (error: Error) => {
        console.error('Erro ao carregar operadora:', error);
        this.snackBar.open('Erro ao carregar operadora', 'Fechar', { duration: 3000 });
      }
    });
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      const operadora: CreateOperadoraDto = this.form.getRawValue();
      
      if (this.isEdicao && this.operadoraId) {
        this.operadoraService.update(this.operadoraId, operadora).subscribe({
          next: () => {
            this.snackBar.open('Operadora atualizada com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['..'], { relativeTo: this.route });
          },
          error: (error) => {
            console.error('Erro ao atualizar operadora:', error);
            this.snackBar.open(
              error.status === 0
                ? 'Não foi possível conectar ao servidor. Verifique sua conexão.'
                : error.error?.message || 'Erro ao atualizar operadora',
              'Fechar',
              { duration: 5000 }
            );
          }
        });
      } else {
        this.operadoraService.create(operadora).subscribe({
          next: () => {
            this.snackBar.open('Operadora criada com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['..'], { relativeTo: this.route });
          },
          error: (error) => {
            console.error('Erro ao criar operadora:', error);
            this.snackBar.open(
              error.status === 0
                ? 'Não foi possível conectar ao servidor. Verifique sua conexão.'
                : error.error?.message || 'Erro ao criar operadora',
              'Fechar',
              { duration: 5000 }
            );
          }
        });
      }
    } else {
      this.snackBar.open('Por favor, preencha todos os campos corretamente', 'Fechar', { duration: 5000 });
    }
  }

  protected cancelar(): void {
    void this.router.navigate(['/operadoras']);
  }
}
