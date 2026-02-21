import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddVehicleDialogComponent } from '../add-vehicle-dialog/add-vehicle-dialog.component';
import { VehiclesService } from '../../../services/vehicles.service';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatTooltipModule],
  template: `
    <div class="page-container">
      <div class="list-header">
        <div class="header-info">
          <h1>Vehicle Registry</h1>
          <p>Manage and monitor your entire transport fleet in real-time</p>
        </div>
        <button mat-raised-button class="btn-primary" (click)="openAddVehicle()">
          <mat-icon>add</mat-icon>
          <span>Add New Vehicle</span>
        </button>
      </div>
      
      <div class="table-card glass-card">
        <table mat-table [dataSource]="vehicles" class="premium-table">
          <ng-container matColumnDef="licensePlate">
            <th mat-header-cell *matHeaderCellDef> License Plate </th>
            <td mat-cell *matCellDef="let element"> 
              <div class="plate-cell">
                <mat-icon>subtitles</mat-icon>
                <span>{{element.licensePlate}}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="model">
            <th mat-header-cell *matHeaderCellDef> Vehicle Model </th>
            <td mat-cell *matCellDef="let element"> 
              <div class="model-cell">
                <div class="model-name">{{element.model}}</div>
                <div class="model-specs">{{element.maxCapacityKg}}kg · {{element.odometer}}km</div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Operations </th>
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
                <button mat-icon-button class="edit-btn" (click)="openEditVehicle(element)" matTooltip="Edit Registry">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button class="delete-btn" (click)="deleteVehicle(element.id || element.Id)" matTooltip="Retire Asset">
                  <mat-icon>delete_outline</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="premium-row"></tr>
        </table>
        
        <div *ngIf="vehicles.length === 0" class="empty-state">
          <mat-icon>minor_crash</mat-icon>
          <p>No vehicles found in your registry</p>
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

    .plate-cell { display: flex; align-items: center; gap: 8px; color: var(--primary); font-weight: 700; font-family: 'Inter', monospace; }
    .plate-cell mat-icon { font-size: 20px; width: 20px; height: 20px; color: var(--text-muted); }

    .model-cell { display: flex; flex-direction: column; gap: 2px; }
    .model-name { font-weight: 600; color: var(--text-primary); }
    .model-specs { font-size: 0.75rem; color: var(--text-muted); }

    .pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
    .status-available .pulse-dot { box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2); }
    .status-ontrip .pulse-dot { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }

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
export class VehicleListComponent implements OnInit {
  displayedColumns: string[] = ['licensePlate', 'model', 'status', 'actions'];
  vehicles: any[] = [];
  private vehiclesService = inject(VehiclesService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.vehiclesService.getAll().subscribe(data => {
      this.vehicles = data;
    });
  }

  openAddVehicle() {
    const dialogRef = this.dialog.open(AddVehicleDialogComponent, {
      width: '480px',
      panelClass: 'premium-dialog'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadVehicles();
      }
    });
  }

  openEditVehicle(vehicle: any) {
    const dialogRef = this.dialog.open(AddVehicleDialogComponent, {
      width: '480px',
      panelClass: 'premium-dialog',
      data: vehicle
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadVehicles();
      }
    });
  }

  deleteVehicle(id: number) {
    if (!id) {
      alert('Cannot delete: Vehicle ID is missing.');
      return;
    }
    if (confirm('Are you sure you want to retire this vehicle from the registry? Note: This will also delete all associated trips and logs.')) {
      this.vehiclesService.delete(id).subscribe({
        next: () => {
          this.loadVehicles();
        },
        error: (err) => {
          console.error('Delete failed', err);
          alert('Failed to delete vehicle. There might be a connection issue or operational blocker.');
        }
      });
    }
  }
}
