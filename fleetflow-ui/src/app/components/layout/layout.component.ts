import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav glass-card">
        <div class="logo-container">
          <div class="logo-text">Fleet<span>Flow</span></div>
        </div>
        
        <div class="user-profile">
          <div class="avatar">AD</div>
          <div class="user-info">
            <div class="user-name">Admin User</div>
            <div class="user-role">Fleet Manager</div>
          </div>
        </div>

        <mat-nav-list class="nav-list">
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Overview</span>
          </a>
          <div class="nav-label">Assets</div>
          <a mat-list-item routerLink="/vehicles" routerLinkActive="active">
            <mat-icon matListItemIcon>local_shipping</mat-icon>
            <span matListItemTitle>Vehicles</span>
          </a>
          <a mat-list-item routerLink="/drivers" routerLinkActive="active">
            <mat-icon matListItemIcon>person</mat-icon>
            <span matListItemTitle>Drivers</span>
          </a>
          <div class="nav-label">Operations</div>
          <a mat-list-item routerLink="/dispatch" routerLinkActive="active">
            <mat-icon matListItemIcon>assignment_turned_in</mat-icon>
            <span matListItemTitle>Trip Dispatch</span>
          </a>
          <a mat-list-item routerLink="/maintenance" routerLinkActive="active">
            <mat-icon matListItemIcon>engineering</mat-icon>
            <span matListItemTitle>Maintenance</span>
          </a>
          <a mat-list-item routerLink="/fuel" routerLinkActive="active">
            <mat-icon matListItemIcon>ev_station</mat-icon>
            <span matListItemTitle>Fuel History</span>
          </a>
          <div class="nav-label">Insights</div>
          <a mat-list-item routerLink="/reports" routerLinkActive="active">
            <mat-icon matListItemIcon>insights</mat-icon>
            <span matListItemTitle>Analytics</span>
          </a>
        </mat-nav-list>

        <div class="logout-section">
          <button mat-button class="logout-btn" (click)="onLogout()">
            <mat-icon>logout</mat-icon>
            <span>Log out</span>
          </button>
        </div>
      </mat-sidenav>
      
      <mat-sidenav-content class="main-content">
        <header class="main-header glass-card">
          <div class="page-title">{{ title }}</div>
          <div class="header-actions">
          </div>
        </header>
        
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container { height: 100vh; background: #0f172a; }
    .sidenav { 
      width: 280px; 
      border: none !important; 
      display: flex; 
      flex-direction: column;
      margin: 12px;
      height: calc(100vh - 24px) !important;
      border-radius: 20px !important;
      background: #1e293b !important;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3) !important;
    }
    
    .logo-container { 
      padding: 32px 24px; 
      display: flex; 
      align-items: center; 
      gap: 12px;
    }
    .logo-text { 
      font-size: 1.75rem; 
      font-weight: 900; 
      color: #818cf8;
      letter-spacing: -1.5px;
      line-height: 1;
    }
    .logo-text span { color: #6366f1; font-weight: 400; }
    
    .user-profile {
      padding: 0 24px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .avatar {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: white;
    }
    .user-name { font-weight: 700; color: white !important; font-size: 1rem; }
    .user-role { font-size: 0.8rem; color: rgba(255,255,255,0.7) !important; }
    
    .nav-list { flex: 1; padding: 0 12px; }
    .nav-label { 
      padding: 24px 12px 8px; 
      font-size: 0.75rem; 
      text-transform: uppercase; 
      letter-spacing: 0.12em; 
      color: white !important; 
      font-weight: 800;
      opacity: 0.9;
    }
    
    .mat-nav-list a { 
      margin-bottom: 4px;
      border-radius: 12px !important;
      transition: all 0.2s ease;
    }
    
    /* Aggressive white forcing for icons and text */
    ::ng-deep .sidenav .mat-mdc-list-item-title,
    ::ng-deep .sidenav .mat-mdc-list-item-icon,
    ::ng-deep .sidenav mat-icon,
    ::ng-deep .sidenav span {
      color: white !important;
    }

    .mat-nav-list a:hover { 
      background: rgba(255,255,255,0.1) !important;
    }
    
    .active { 
      background: rgba(99, 102, 241, 0.25) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    
    .logout-section { padding: 24px; border-top: 1px solid rgba(255,255,255,0.05); }
    .logout-btn { 
      width: 100%; 
      text-align: left; 
      color: #fb7185 !important; 
      border-radius: 12px !important;
    }
    .logout-btn mat-icon { color: #fb7185 !important; }
    
    .main-content { padding: 12px 24px 24px 12px; }
    .main-header {
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      margin-bottom: 24px;
      border-radius: 16px !important;
    }
    .page-title { font-size: 1.1rem; font-weight: 600; color: #f8fafc; }
    .header-actions { display: flex; gap: 8px; color: #94a3b8; }
    .page-content { padding: 0; }
  `]
})
export class LayoutComponent {
  title = 'Overview';
  constructor(private authService: AuthService, private router: Router) {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      if (url.includes('dashboard')) this.title = 'Fleet Analytics Dashboard';
      else if (url.includes('vehicles')) this.title = 'Vehicle Registry';
      else if (url.includes('drivers')) this.title = 'Driver Management';
      else if (url.includes('dispatch')) this.title = 'Dispatch Operations';
      else if (url.includes('maintenance')) this.title = 'Service & Maintenance';
      else if (url.includes('fuel')) this.title = 'Fuel Consumption logs';
      else if (url.includes('reports')) this.title = 'Operational Insights';
    });
  }
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
