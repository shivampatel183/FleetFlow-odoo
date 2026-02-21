import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="dashboard-container">
      <div class="welcome-banner glass-card">
        <div class="welcome-text">
          <h2>Welcome back, Fleet Manager! 👋</h2>
          <p>System is running at 94% efficiency today. There are 2 vehicles scheduled for maintenance.</p>
        </div>
        <button mat-raised-button class="btn-primary">View Full Report</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card glass-card" *ngFor="let kpi of kpis">
          <div class="kpi-content">
            <div class="kpi-header">
              <div class="kpi-icon-container" [style.background]="kpi.color + '20'">
                <mat-icon [style.color]="kpi.color">{{ kpi.icon }}</mat-icon>
              </div>
              <div class="kpi-trend" [style.color]="kpi.trend >= 0 ? '#4ade80' : '#f87171'">
                {{ kpi.trend >= 0 ? '↑' : '↓' }} {{ Math.abs(kpi.trend) }}%
              </div>
            </div>
            <div class="kpi-body">
              <div class="kpi-title">{{ kpi.title }}</div>
              <div class="kpi-value">{{ kpi.value }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="secondary-grid">
        <div class="content-card glass-card recent-activity">
          <div class="card-header">
            <h3>Recent Operational Activity</h3>
            <button mat-button color="primary">View All</button>
          </div>
          <div class="activity-list">
            <div class="activity-item" *ngFor="let activity of activities">
              <div class="activity-icon">{{ activity.icon }}</div>
              <div class="activity-details">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
              <div class="activity-status" [class]="activity.statusClass">{{ activity.status }}</div>
            </div>
          </div>
        </div>

        <div class="content-card glass-card fleet-health">
          <div class="card-header">
            <h3>Fleet Composition</h3>
          </div>
          <div class="health-stats">
            <div class="health-item">
              <div class="health-label">Heavy Trucks</div>
              <div class="health-bar-bg"><div class="health-bar" style="width: 75%; background: #6366f1;"></div></div>
              <div class="health-value">12 / 15</div>
            </div>
            <div class="health-item">
              <div class="health-label">Vans & LCVs</div>
              <div class="health-bar-bg"><div class="health-bar" style="width: 90%; background: #10b981;"></div></div>
              <div class="health-value">9 / 10</div>
            </div>
            <div class="health-item">
              <div class="health-label">Maintenance Pending</div>
              <div class="health-bar-bg"><div class="health-bar" style="width: 20%; background: #f43f5e;"></div></div>
              <div class="health-value">2 / 25</div>
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

    .welcome-banner {
      padding: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.05));
    }
    .welcome-text h2 { margin: 0 0 8px; font-size: 1.5rem; }
    .welcome-text p { margin: 0; color: #94a3b8; }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }
    .kpi-card { padding: 24px; transition: transform 0.2s; }
    .kpi-card:hover { transform: translateY(-4px); }
    
    .kpi-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .kpi-icon-container { padding: 10px; border-radius: 12px; display: flex; }
    .kpi-trend { font-size: 0.75rem; font-weight: 600; padding: 4px 8px; background: rgba(255,255,255,0.05); border-radius: 8px; }
    
    .kpi-body { }
    .kpi-title { font-size: 0.875rem; color: #94a3b8; font-weight: 500; margin-bottom: 4px; }
    .kpi-value { font-size: 1.75rem; font-weight: 700; color: #f8fafc; }

    .secondary-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }
    
    .content-card { padding: 24px; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .card-header h3 { margin: 0; font-size: 1.1rem; }

    .activity-list { display: flex; flex-direction: column; gap: 16px; }
    .activity-item { 
      display: flex; 
      align-items: center; 
      gap: 16px; 
      padding-bottom: 16px; 
      border-bottom: 1px solid rgba(255,255,255,0.05); 
    }
    .activity-icon { font-size: 1.25rem; }
    .activity-details { flex: 1; }
    .activity-title { font-size: 0.9rem; font-weight: 500; }
    .activity-time { font-size: 0.75rem; color: #64748b; }
    .activity-status { font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
    
    .health-stats { display: flex; flex-direction: column; gap: 20px; }
    .health-item { display: flex; flex-direction: column; gap: 8px; }
    .health-label { font-size: 0.85rem; color: #94a3b8; }
    .health-bar-bg { height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; }
    .health-bar { height: 100%; border-radius: 3px; }
    .health-value { font-size: 0.8rem; text-align: right; color: #f8fafc; }
  `]
})
export class DashboardComponent implements OnInit {
  Math = Math;
  kpis = [
    { title: 'Total Revenue', value: '$84,250', icon: 'payments', color: '#6366f1', trend: +12.5 },
    { title: 'Active Fleet', value: '22 / 25', icon: 'local_shipping', color: '#3b82f6', trend: +4.2 },
    { title: 'In Service', value: '3 Vehicles', icon: 'engineering', color: '#f43f5e', trend: -2.1 },
    { title: 'Safety Score', value: '98.4', icon: 'verified_user', color: '#10b981', trend: +0.8 }
  ];

  activities = [
    { title: 'Trip COMP-104 Dispatched', time: '12 mins ago', icon: '🚚', status: 'Active', statusClass: 'status-ontrip' },
    { title: 'Vehicle MH-12-AS-1234 Maintenance', time: '1 hour ago', icon: '🛠️', status: 'Service', statusClass: 'status-inshop' },
    { title: 'Fuel Log Added - Truck #5', time: '3 hours ago', icon: '⛽', status: 'Logged', statusClass: 'status-available' },
    { title: 'New Driver Onboarded', time: '5 hours ago', icon: '👤', status: 'Ready', statusClass: 'status-available' }
  ];

  ngOnInit() { }
}
