import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MaterialModule],
  template: `
    <div class="content-container">
      <h1>Dashboard</h1>
      <div class="dashboard-content">
        <p>Bem-vindo ao Sistema de Gestão de Telecom</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-content {
      margin-top: 20px;
    }
  `]
})
export class DashboardComponent {}
