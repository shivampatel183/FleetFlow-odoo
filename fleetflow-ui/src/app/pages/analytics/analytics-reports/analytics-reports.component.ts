import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-analytics-reports',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page-container">
      <div class="list-header">
        <div class="header-info">
          <h1>Business Performance</h1>
          <p>Fleet financials and operational ROI analysis</p>
        </div>
        <div class="export-actions">
           <button mat-button class="glass-btn"><mat-icon>file_download</mat-icon> PDF Report</button>
           <button mat-raised-button class="btn-primary"><mat-icon>description</mat-icon> Export CSV</button>
        </div>
      </div>
      
      <div class="analytics-grid">
         <div class="chart-box glass-card">
            <div class="card-header">
               <h3>Cumulative Fleet Revenue</h3>
               <span class="badge positive">+18.2%</span>
            </div>
            <div class="chart-placeholder">
               <!-- Future Chart.js integration -->
               <div class="mock-bars">
                  <div class="bar" style="height: 40%"></div>
                  <div class="bar" style="height: 60%"></div>
                  <div class="bar" style="height: 55%"></div>
                  <div class="bar" style="height: 80%"></div>
                  <div class="bar" style="height: 95%"></div>
                  <div class="bar highlight" style="height: 100%"></div>
               </div>
            </div>
         </div>

         <div class="stat-boxes">
            <div class="mini-stat glass-card">
               <div class="stat-label">Total Logs Exported</div>
               <div class="stat-val">1,204</div>
            </div>
            <div class="mini-stat glass-card active">
               <div class="stat-label">System Uptime</div>
               <div class="stat-val">99.9%</div>
            </div>
         </div>
      </div>

      <div class="table-card glass-card">
        <table mat-table [dataSource]="reports" class="premium-table">
          <ng-container matColumnDef="metric">
            <th mat-header-cell *matHeaderCellDef> Performance Indicator </th>
            <td mat-cell *tdCellDef="let element"> {{element.metric}} </td>
          </ng-container>

          <ng-container matColumnDef="value">
            <th mat-header-cell *matHeaderCellDef> Current Value </th>
            <td mat-cell *tdCellDef="let element"> {{element.value}} </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="premium-row"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container { animation: fadeIn 0.4s ease-out; }
    .list-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
    .header-info h1 { margin: 0 0 4px; font-size: 1.75rem; }
    .header-info p { margin: 0; color: #64748b; font-size: 0.95rem; }
    .export-actions { display: flex; gap: 12px; }
    .glass-btn { background: rgba(255,255,255,0.05) !important; color: #94a3b8 !important; border-radius: 8px !important; }

    .analytics-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px; }
    .chart-box { padding: 24px; min-height: 280px; display: flex; flex-direction: column; }
    .card-header { display: flex; justify-content: space-between; margin-bottom: 32px; }
    .chart-placeholder { flex: 1; display: flex; align-items: flex-end; }
    .mock-bars { display: flex; gap: 16px; align-items: flex-end; width: 100%; height: 120px; padding-bottom: 20px; }
    .bar { flex: 1; background: rgba(99, 102, 241, 0.2); border-radius: 4px 4px 0 0; transition: all 0.5s; }
    .bar.highlight { background: #6366f1; box-shadow: 0 0 20px rgba(99,102,241,0.4); }

    .stat-boxes { display: flex; flex-direction: column; gap: 16px; }
    .mini-stat { padding: 24px; flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .mini-stat.active { background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1)); }
    .stat-label { font-size: 0.8rem; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; }
    .stat-val { font-size: 1.75rem; font-weight: 800; color: #f8fafc; }

    .table-card { padding: 8px; }
    .badge { padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
    .badge.positive { background: rgba(16,185,129,0.1); color: #10b981; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AnalyticsReportsComponent implements OnInit {
  displayedColumns: string[] = ['metric', 'value'];
  reports: any[] = [];
  private http = inject(HttpClient);

  ngOnInit() {
    this.http.get<any[]>('http://localhost:5104/api/analytics/kpis').subscribe(data => {
      this.reports = data;
    });
  }
}
