import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="dashboard-container">
      <div class="welcome-banner glass-card">
        <div class="welcome-text">
          <h1>Fleet Overview Dashboard</h1>
          <p>Real-time operational metrics and health monitoring</p>
        </div>
        <div class="banner-stats">
          <div class="stat-item">
            <span class="stat-label">System Efficiency</span>
            <span class="stat-value">{{metrics?.utilizationRate | number:'1.1-1'}}%</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-label">Pending Dispatch</span>
            <span class="stat-value">{{metrics?.pendingTrips}}</span>
          </div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card glass-card">
          <div class="kpi-header">
            <div class="kpi-icon-container" style="background: rgba(99, 102, 241, 0.1)">
              <mat-icon style="color: #6366f1">payments</mat-icon>
            </div>
            <div class="kpi-tag">Monthly</div>
          </div>
          <div class="kpi-body">
            <div class="kpi-title">Total Revenue</div>
            <div class="kpi-value">\${{metrics?.totalRevenue | number}}</div>
          </div>
        </div>

        <div class="kpi-card glass-card">
          <div class="kpi-header">
            <div class="kpi-icon-container" style="background: rgba(59, 130, 246, 0.1)">
              <mat-icon style="color: #3b82f6">local_shipping</mat-icon>
            </div>
            <div class="kpi-tag">Active</div>
          </div>
          <div class="kpi-body">
            <div class="kpi-title">Fleet Deployment</div>
            <div class="kpi-value">{{metrics?.onTrip}} / {{metrics?.totalVehicles}}</div>
          </div>
        </div>

        <div class="kpi-card glass-card">
          <div class="kpi-header">
            <div class="kpi-icon-container" style="background: rgba(244, 63, 94, 0.1)">
              <mat-icon style="color: #f43f5e">engineering</mat-icon>
            </div>
            <div class="kpi-tag">Alert</div>
          </div>
          <div class="kpi-body">
            <div class="kpi-title">In Service</div>
            <div class="kpi-value">{{metrics?.inShop}} Vehicles</div>
          </div>
        </div>

        <div class="kpi-card glass-card">
          <div class="kpi-header">
            <div class="kpi-icon-container" style="background: rgba(16, 185, 129, 0.1)">
              <mat-icon style="color: #10b981">account_balance_wallet</mat-icon>
            </div>
            <div class="kpi-tag">Costs</div>
          </div>
          <div class="kpi-body">
            <div class="kpi-title">Operational Cost</div>
            <div class="kpi-value">\${{metrics?.totalOperationalCost | number}}</div>
          </div>
        </div>
      </div>

      <div class="secondary-grid">
        <div class="content-card glass-card recent-activity">
          <div class="card-header">
            <h3>Recent Logistical Activities</h3>
            <button mat-button color="primary">Operational Logs</button>
          </div>
          <div class="activity-list">
            <div class="activity-item" *ngFor="let activity of metrics?.activities">
              <div class="activity-icon">{{ activity.icon }}</div>
              <div class="activity-details">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-time">{{ activity.time | date:'shortTime' }} · {{ activity.time | date:'mediumDate' }}</div>
              </div>
              <div class="activity-status" [class]="activity.statusClass">{{ activity.status }}</div>
            </div>
            <div *ngIf="!metrics?.activities?.length" class="empty-state">
              <mat-icon>history</mat-icon>
              <p>No recent activities recorded</p>
            </div>
          </div>
        </div>

        <div class="content-card glass-card fleet-health">
          <div class="card-header">
            <h3>Fleet Composition Health</h3>
          </div>
          <div class="health-stats">
            <div class="health-item" *ngFor="let item of metrics?.fleetHealth">
              <div class="health-info">
                <span class="health-label">{{item.label}}</span>
                <span class="health-count">{{item.value}} units</span>
              </div>
              <div class="health-bar-bg">
                <div class="health-bar" [style.width]="item.percentage + '%'" [style.background]="item.color"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 0; display: flex; flex-direction: column; gap: 24px; animation: fadeIn 0.5s ease-out; }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .glass-card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
    }

    .welcome-banner {
      padding: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.08));
    }
    .welcome-text h1 { margin: 0 0 6px; font-size: 1.8rem; color: #f8fafc; }
    .welcome-text p { margin: 0; color: #cbd5e1; font-size: 1rem; }

    .banner-stats { display: flex; align-items: center; gap: 32px; }
    .stat-item { display: flex; flex-direction: column; align-items: flex-end; }
    .stat-label { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
    .stat-value { font-size: 1.4rem; font-weight: 800; color: #6366f1; }
    .stat-divider { width: 1px; height: 32px; background: rgba(255,255,255,0.1); }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 24px;
    }
    .kpi-card { padding: 24px; position: relative; overflow: hidden; }
    .kpi-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .kpi-icon-container { padding: 12px; border-radius: 14px; display: flex; }
    .kpi-tag { font-size: 0.65rem; font-weight: 700; color: #94a3b8; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 20px; text-transform: uppercase; }
    
    .kpi-title { font-size: 0.9rem; color: #cbd5e1; font-weight: 500; margin-bottom: 6px; }
    .kpi-value { font-size: 2rem; font-weight: 800; color: #f8fafc; letter-spacing: -0.02em; }

    .secondary-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }
    
    .content-card { padding: 28px; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
    .card-header h3 { margin: 0; font-size: 1.25rem; font-weight: 700; color: #f8fafc; }

    .activity-list { display: flex; flex-direction: column; gap: 18px; }
    .activity-item { 
      display: flex; 
      align-items: center; 
      gap: 16px; 
      padding-bottom: 18px; 
      border-bottom: 1px solid rgba(255,255,255,0.05); 
    }
    .activity-icon { font-size: 1.5rem; filter: grayscale(0.2); }
    .activity-details { flex: 1; }
    .activity-title { font-size: 0.95rem; font-weight: 600; color: #f1f5f9; margin-bottom: 2px; }
    .activity-time { font-size: 0.75rem; color: #94a3b8; }
    .activity-status { font-size: 0.65rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
    
    .health-stats { display: flex; flex-direction: column; gap: 24px; }
    .health-item { display: flex; flex-direction: column; gap: 10px; }
    .health-info { display: flex; justify-content: space-between; align-items: center; }
    .health-label { font-size: 0.9rem; color: #cbd5e1; font-weight: 500; }
    .health-count { font-size: 0.8rem; color: #94a3b8; }
    .health-bar-bg { height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; padding: 1px; }
    .health-bar { height: 100%; border-radius: 3px; }

    .empty-state { padding: 48px; text-align: center; color: #64748b; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; opacity: 0.1; margin-bottom: 16px; }

    @media (max-width: 1024px) {
      .secondary-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  metrics: any;

  ngOnInit() {
    this.fetchMetrics();
  }

  fetchMetrics() {
    this.http.get('http://localhost:5104/api/analytics/kpis').subscribe(data => {
      this.metrics = data;
    });
  }
}
