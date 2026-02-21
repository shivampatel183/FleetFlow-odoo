import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddFuelDialogComponent } from '../add-fuel-dialog/add-fuel-dialog.component';

@Component({
  selector: 'app-fuel-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="page-container">
      <div class="list-header">
        <div class="header-info">
          <h1>Fuel Consumption</h1>
          <p>Refueling logs and energy efficiency tracking</p>
        </div>
        <button mat-raised-button class="btn-primary" (click)="openAddFuel()">
          <mat-icon>gas_meter</mat-icon>
          <span>Log Entry</span>
        </button>
      </div>
      
      <div class="table-card glass-card">
        <table mat-table [dataSource]="logs" class="premium-table">
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef> Date </th>
            <td mat-cell *matCellDef="let element"> {{(element.date || element.Date) | date:'mediumDate'}} </td>
          </ng-container>

          <ng-container matColumnDef="vehicle">
            <th mat-header-cell *matHeaderCellDef> Asset </th>
            <td mat-cell *matCellDef="let element"> 
               <div class="asset-cell">
                 <mat-icon>local_gas_station</mat-icon>
                 <span>Vehicle #{{element.vehicleId}}</span>
               </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="liters">
            <th mat-header-cell *matHeaderCellDef> Volume </th>
            <td mat-cell *matCellDef="let element"> {{element.liters || element.Liters}} Liters </td>
          </ng-container>

          <ng-container matColumnDef="cost">
            <th mat-header-cell *matHeaderCellDef> Expense </th>
            <td mat-cell *matCellDef="let element"> 
              <div class="cost-cell">{{(element.cost || element.Cost) | currency}}</div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="premium-row"></tr>
        </table>

        <div *ngIf="logs.length === 0" class="empty-state">
           <mat-icon>ev_station</mat-icon>
           <p>No fuel consumption logs found</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { animation: fadeIn 0.4s ease-out; }
    .list-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
    .header-info h1 { margin: 0 0 4px; font-size: 1.75rem; }
    .header-info p { margin: 0; color: #64748b; font-size: 0.95rem; }
    .table-card { padding: 8px; overflow: hidden; }
    .premium-table { width: 100%; }
    .premium-row { height: 64px; }
    .asset-cell { display: flex; align-items: center; gap: 8px; color: #6366f1; font-weight: 600; }
    .asset-cell mat-icon { font-size: 18px; width: 18px; height: 18px; color: #94a3b8; }
    .cost-cell { font-weight: 700; color: #f43f5e; }
    .empty-state { padding: 64px; text-align: center; color: #64748b; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class FuelListComponent implements OnInit {
  displayedColumns: string[] = ['date', 'vehicle', 'liters', 'cost'];
  logs: any[] = [];
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.http.get<any[]>('http://localhost:5104/api/fuel').subscribe(data => {
      this.logs = data;
    });
  }

  openAddFuel() {
    const dialogRef = this.dialog.open(AddFuelDialogComponent, {
      width: '480px',
      panelClass: 'premium-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadLogs();
      }
    });
  }
}
