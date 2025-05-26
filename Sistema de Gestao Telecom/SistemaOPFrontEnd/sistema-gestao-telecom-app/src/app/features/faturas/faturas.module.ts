import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ListaFaturasComponent } from './pages/lista-faturas/lista-faturas.component';
import { FormFaturaComponent } from './pages/form-fatura/form-fatura.component';

const routes: Routes = [
  {
    path: '',
    component: ListaFaturasComponent
  },
  {
    path: 'novo',
    component: FormFaturaComponent
  },
  {
    path: 'editar/:id',
    component: FormFaturaComponent
  }
];

@NgModule({
  declarations: [
    ListaFaturasComponent,
    FormFaturaComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class FaturasModule { }
