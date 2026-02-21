import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddDriverDialogComponent } from '../add-driver-dialog/add-driver-dialog.component';
import { DriversService } from '../../../services/drivers.service';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatTooltipModule],
  template: `
    <div class="page-container">
      <div class="list-header">
        <div class="header-info">
          <h1>Drivers Management</h1>
          <p>Personnel registry and compliance monitoring center</p>
        </div>
        <button mat-raised-button class="btn-primary" (click)="openAddDriver()">
          <mat-icon>person_add</mat-icon>
          <span>Enroll New Driver</span>
        </button>
      </div>
      
      <div class="table-card glass-card">
        <table mat-table [dataSource]="drivers" class="premium-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Personnel </th>
            <td mat-cell *matCellDef="let element"> 
              <div class="driver-cell">
                <div class="driver-avatar">{{element.name.substring(0,2).toUpperCase()}}</div>
                <div class="driver-info">
                  <div class="driver-name">{{element.name}}</div>
                  <div class="driver-id">ID: FL-{{element.id.toString().padStart(4, '0')}}</div>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="licenseNumber">
            <th mat-header-cell *matHeaderCellDef> Certification </th>
            <td mat-cell *matCellDef="let element"> 
              <div class="license-cell">
                <mat-icon>verified</mat-icon>
                <span>{{element.licenseNumber}}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="expiry">
            <th mat-header-cell *matHeaderCellDef> Validity </th>
            <td mat-cell *matCellDef="let element"> 
              <div class="expiry-cell" [class.warning]="isExpiringSoon(element.licenseExpiryDate)">
                <mat-icon>event</mat-icon>
                <span>{{element.licenseExpiryDate | date:'mediumDate'}}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Duty Status </th>
            <td mat-cell *matCellDef="let element"> 
              <div class="status-pill-container">
                <span class="status-pill" [ngClass]="'status-' + element.status.toLowerCase()">
                  <div class="pulse-dot"></div>
                  {{element.status}}
                </span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> </th>
            <td mat-cell *matCellDef="let element">
              <div class="action-buttons">
                <button mat-icon-button class="edit-btn" (click)="openEditDriver(element)" matTooltip="Modify Enrollment">
                  <mat-icon>edit_note</mat-icon>
                </button>
                <button mat-icon-button class="delete-btn" (click)="deleteDriver(element.id || element.Id)" matTooltip="Revoke Access">
                  <mat-icon>person_remove</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="premium-row"></tr>
        </table>

        <div *ngIf="drivers.length === 0" class="empty-state">
          <mat-icon>person_off</mat-icon>
          <p>No drivers enrolled in the system</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { animation: fadeIn 0.4s ease-out; }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .list-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-end; 
      margin-bottom: 32px; 
      gap: 16px;
    }
    .header-info h1 { margin: 0 0 4px; font-size: 1.75rem; color: var(--text-primary); }
    .header-info p { margin: 0; color: var(--text-secondary); font-size: 0.95rem; }

    .table-card { padding: 8px; overflow-x: auto; }
    .premium-table { width: 100%; min-width: 600px; border-collapse: separate; border-spacing: 0; }
    
    .premium-row { height: 72px; cursor: pointer; transition: background 0.2s; }
    .premium-row:hover { background: rgba(255, 255, 255, 0.03) !important; }

    .driver-cell { display: flex; align-items: center; gap: 12px; }
    .driver-avatar { 
      width: 40px; 
      height: 40px; 
      border-radius: 10px; 
      background: rgba(99, 102, 241, 0.1); 
      color: var(--primary); 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-weight: 700;
      font-size: 0.85rem;
      border: 1px solid rgba(99, 102, 241, 0.2);
    }
    .driver-name { font-weight: 600; color: var(--text-primary); }
    .driver-id { font-size: 0.75rem; color: var(--text-muted); }

    .license-cell { display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 0.9rem; }
    .license-cell mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--accent); }

    .expiry-cell { display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 0.9rem; }
    .expiry-cell mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .expiry-cell.warning { color: var(--secondary); }

    .action-buttons { display: flex; gap: 4px; }
    .edit-btn { color: var(--primary); }
    .edit-btn:hover { background: rgba(99, 102, 241, 0.1); }
    .delete-btn { color: var(--secondary); }
    .delete-btn:hover { background: rgba(244, 63, 94, 0.1); }

    .empty-state { padding: 64px; text-align: center; color: var(--text-muted); }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.2; }

    @media (max-width: 768px) {
      .list-header { flex-direction: column; align-items: flex-start; }
      .header-info h1 { font-size: 1.5rem; }
      .btn-primary { width: 100%; }
    }
  `]
})
export class DriverListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'licenseNumber', 'expiry', 'status', 'actions'];
  drivers: any[] = [];
  private driversService = inject(DriversService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.loadDrivers();
  }

  loadDrivers() {
    this.driversService.getAll().subscribe(data => {
      this.drivers = data;
    });
  }

  openEditDriver(driver: any) {
    const dialogRef = this.dialog.open(AddDriverDialogComponent, {
      width: '480px',
      panelClass: 'premium-dialog',
      data: driver
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadDrivers();
      }
    });
  }

  isExpiringSoon(dateStr: string): boolean {
    const expiry = new Date(dateStr);
    const today = new Date();
    const diff = expiry.getTime() - today.getTime();
    return diff < 1000 * 60 * 60 * 24 * 30; // 30 days
  }

  openAddDriver() {
    const dialogRef = this.dialog.open(AddDriverDialogComponent, {
      width: '480px',
      panelClass: 'premium-dialog'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadDrivers();
      }
    });
  }

  deleteDriver(id: number) {
    if (!id) {
      alert('Cannot delete: Driver ID is missing.');
      return;
    }
    if (confirm('Are you sure you want to revoke access for this personnel? Note: This will also delete all associated trips.')) {
      this.driversService.delete(id).subscribe({
        next: () => {
          this.loadDrivers();
        },
        error: (err) => {
          console.error('Delete failed', err);
          alert('Failed to delete driver. There might be a connection issue or operational blocker.');
        }
      });
    }
  }
}
