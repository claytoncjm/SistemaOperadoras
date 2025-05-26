import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ListaOperadorasComponent } from './pages/lista-operadoras/lista-operadoras.component';
import { FormOperadoraComponent } from './pages/form-operadora/form-operadora.component';

const routes: Routes = [
  {
    path: '',
    component: ListaOperadorasComponent
  },
  {
    path: 'novo',
    component: FormOperadoraComponent
  },
  {
    path: 'editar/:id',
    component: FormOperadoraComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    ListaOperadorasComponent,
    FormOperadoraComponent
  ]
})
export class OperadorasModule { }
