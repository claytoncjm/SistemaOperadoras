import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Chart } from 'chart.js/auto';
import { DashboardService, DashboardData } from '../../services/dashboard.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class DashboardComponent implements OnInit {
  @ViewChild('evolucaoMensalChart') evolucaoMensalChart!: ElementRef;
  @ViewChild('distribuicaoOperadorasChart') distribuicaoOperadorasChart!: ElementRef;
  @ViewChild('faturasStatusChart') faturasStatusChart!: ElementRef;

  dashboardData: DashboardData | null = null;
  loading = true;
  charts: { [key: string]: Chart } = {};

  constructor(
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.dashboardService.getDashboardData()
      .pipe(
        catchError(error => {
          this.snackBar.open('Erro ao carregar dados do dashboard', 'Fechar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          return of({ success: false, data: null });
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(response => {
        if (response.success && response.data) {
          this.dashboardData = response.data;
          this.initializeCharts();
        }
      });
  }

  initializeCharts(): void {
    if (!this.dashboardData) return;

    // Evolução Mensal
    const evolucaoCtx = this.evolucaoMensalChart.nativeElement.getContext('2d');
    this.charts['evolucao'] = new Chart(evolucaoCtx, {
      type: 'line',
      data: {
        labels: this.dashboardData.evolucaoMensal.map(item => item.mes),
        datasets: [
          {
            label: 'Faturas Emitidas',
            data: this.dashboardData.evolucaoMensal.map(item => item.faturasEmitidas),
            borderColor: '#4CAF50',
            tension: 0.1
          },
          {
            label: 'Faturas Pagas',
            data: this.dashboardData.evolucaoMensal.map(item => item.faturasPagas),
            borderColor: '#2196F3',
            tension: 0.1
          },
          {
            label: 'Valor Total (R$)',
            data: this.dashboardData.evolucaoMensal.map(item => item.valorTotal),
            borderColor: '#FFC107',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Evolução Mensal'
          }
        }
      }
    });

    // Distribuição por Operadoras
    const distribuicaoCtx = this.distribuicaoOperadorasChart.nativeElement.getContext('2d');
    this.charts['distribuicao'] = new Chart(distribuicaoCtx, {
      type: 'bar',
      data: {
        labels: this.dashboardData.distribuicaoOperadoras.map(item => item.operadora),
        datasets: [
          {
            label: 'Quantidade de Contratos',
            data: this.dashboardData.distribuicaoOperadoras.map(item => item.quantidade),
            backgroundColor: '#4CAF50'
          },
          {
            label: 'Valor Total (R$)',
            data: this.dashboardData.distribuicaoOperadoras.map(item => item.valorTotal),
            backgroundColor: '#2196F3'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Distribuição por Operadoras'
          }
        }
      }
    });

    // Status das Faturas
    const statusCtx = this.faturasStatusChart.nativeElement.getContext('2d');
    this.charts['status'] = new Chart(statusCtx, {
      type: 'doughnut',
      data: {
        labels: this.dashboardData.faturasStatus.map(item => item.status),
        datasets: [{
          data: this.dashboardData.faturasStatus.map(item => item.quantidade),
          backgroundColor: [
            '#4CAF50',  // Pago
            '#FFC107',  // Pendente
            '#F44336',  // Atrasado
            '#9E9E9E'   // Cancelado
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Status das Faturas'
          }
        }
      }
    });
  }
}
