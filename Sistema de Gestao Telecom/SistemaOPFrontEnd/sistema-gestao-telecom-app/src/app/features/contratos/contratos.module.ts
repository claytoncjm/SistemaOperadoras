import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ListaContratosComponent } from './pages/lista-contratos/lista-contratos.component';
import { FormContratoComponent } from './pages/form-contrato/form-contrato.component';

const routes: Routes = [
  {
    path: '',
    component: ListaContratosComponent
  },
  {
    path: 'novo',
    component: FormContratoComponent
  },
  {
    path: 'editar/:id',
    component: FormContratoComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    ListaContratosComponent,
    FormContratoComponent
  ]
})
export class ContratosModule { }
