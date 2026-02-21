import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { AnalyticsService } from '../../../services/analytics.service';

@Component({
  selector: 'app-analytics-reports',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  template: `
    <div class="page-container">
      <div class="list-header">
        <div class="header-info">
          <h1>Reports</h1>
          <p>Live KPI summary and cost report</p>
        </div>
        <button mat-raised-button class="btn-primary" (click)="loadData()">Refresh</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card glass-card">
          <div class="label">Total Revenue</div>
          <div class="value">{{ kpis?.totalRevenue | currency }}</div>
        </div>
        <div class="kpi-card glass-card">
          <div class="label">Operational Cost</div>
          <div class="value">{{ kpis?.totalOperationalCost | currency }}</div>
        </div>
        <div class="kpi-card glass-card">
          <div class="label">Pending Trips</div>
          <div class="value">{{ kpis?.pendingTrips || 0 }}</div>
        </div>
      </div>

      <div class="table-card glass-card">
        <table mat-table [dataSource]="costReport" class="premium-table">
          <ng-container matColumnDef="licensePlate">
            <th mat-header-cell *matHeaderCellDef>Vehicle</th>
            <td mat-cell *matCellDef="let element">{{ element.licensePlate }}</td>
          </ng-container>

          <ng-container matColumnDef="model">
            <th mat-header-cell *matHeaderCellDef>Model</th>
            <td mat-cell *matCellDef="let element">{{ element.model }}</td>
          </ng-container>

          <ng-container matColumnDef="fuelCost">
            <th mat-header-cell *matHeaderCellDef>Fuel Cost</th>
            <td mat-cell *matCellDef="let element">{{ element.fuelCost | currency }}</td>
          </ng-container>

          <ng-container matColumnDef="maintenanceCost">
            <th mat-header-cell *matHeaderCellDef>Maintenance Cost</th>
            <td mat-cell *matCellDef="let element">{{ element.maintenanceCost | currency }}</td>
          </ng-container>

          <ng-container matColumnDef="totalCost">
            <th mat-header-cell *matHeaderCellDef>Total Cost</th>
            <td mat-cell *matCellDef="let element">{{ element.totalCost | currency }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 20px; }
    .list-header { display: flex; justify-content: space-between; align-items: end; gap: 16px; }
    .header-info h1 { margin: 0 0 4px; font-size: 1.5rem; color: var(--text-primary); }
    .header-info p { margin: 0; color: var(--text-muted); }

    .kpi-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
    .kpi-card { padding: 16px; }
    .label { color: var(--text-muted); font-size: 0.85rem; }
    .value { color: var(--text-primary); font-size: 1.4rem; font-weight: 700; margin-top: 6px; }

    .table-card { padding: 8px; overflow-x: auto; }
    .premium-table { width: 100%; min-width: 680px; }

    @media (max-width: 900px) {
      .kpi-grid { grid-template-columns: 1fr; }
      .list-header { flex-direction: column; align-items: flex-start; }
      .btn-primary { width: 100%; }
    }
  `]
})
export class AnalyticsReportsComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);

  displayedColumns: string[] = ['licensePlate', 'model', 'fuelCost', 'maintenanceCost', 'totalCost'];
  kpis: any;
  costReport: any[] = [];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.analyticsService.getKpis().subscribe(data => this.kpis = data);
    this.analyticsService.getCostReport().subscribe(data => this.costReport = data);
  }
}

