import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'operadoras',
    loadChildren: () => import('./features/operadoras/operadoras.module').then(m => m.OperadorasModule)
  },
  {
    path: 'contratos',
    loadChildren: () => import('./features/contratos/contratos.module').then(m => m.ContratosModule)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
