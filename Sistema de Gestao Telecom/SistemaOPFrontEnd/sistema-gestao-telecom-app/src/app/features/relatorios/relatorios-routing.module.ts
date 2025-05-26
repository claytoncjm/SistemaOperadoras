import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RelatoriosCustosComponent } from './pages/relatorios-custos/relatorios-custos.component';
import { RelatoriosVencimentosComponent } from './pages/relatorios-vencimentos/relatorios-vencimentos.component';
import { RelatoriosComparativoComponent } from './pages/relatorios-comparativo/relatorios-comparativo.component';

const routes: Routes = [
  {
    path: 'custos',
    component: RelatoriosCustosComponent,
    title: 'Relatório de Custos por Operadora'
  },
  {
    path: 'vencimentos',
    component: RelatoriosVencimentosComponent,
    title: 'Relatório de Vencimentos'
  },
  {
    path: 'comparativo',
    component: RelatoriosComparativoComponent,
    title: 'Análise Comparativa de Contratos'
  },
  {
    path: '',
    redirectTo: 'custos',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelatoriosRoutingModule { }
