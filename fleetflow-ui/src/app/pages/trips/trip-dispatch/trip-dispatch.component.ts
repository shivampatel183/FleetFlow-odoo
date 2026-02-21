import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-trip-dispatch',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="page-container">
      <div class="list-header">
        <div class="header-info">
          <h1>Trip Dispatch Center</h1>
          <p>Authorize and monitor transport logistics operations</p>
        </div>
      </div>

      <div class="dispatch-layout">
        <div class="dispatch-form-card glass-card">
          <div class="card-header">
            <h3>New Trip Authorization</h3>
          </div>
          <form [formGroup]="dispatchForm" (ngSubmit)="onSubmit()" class="premium-form">
            <div class="form-row-grid">
              <mat-form-field appearance="outline">
                <mat-label>Select Assigned Vehicle</mat-label>
                <mat-select formControlName="vehicleId">
                  <mat-option *ngFor="let v of availableVehicles" [value]="v.id">
                    {{v.licensePlate}} - {{v.model}}
                  </mat-option>
                </mat-select>
                <mat-icon matSuffix>local_shipping</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Select Assigned Driver</mat-label>
                <mat-select formControlName="driverId">
                  <mat-option *ngFor="let d of availableDrivers" [value]="d.id">
                    {{d.name}}
                  </mat-option>
                </mat-select>
                <mat-icon matSuffix>person</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-row-grid">
              <mat-form-field appearance="outline">
                <mat-label>Cargo Weight (kg)</mat-label>
                <input matInput type="number" formControlName="cargoWeight">
                <mat-icon matSuffix>weight</mat-icon>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Estimated Revenue ($)</mat-label>
                <input matInput type="number" formControlName="revenue">
                <mat-icon matSuffix>payments</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-row-grid">
              <mat-form-field appearance="outline">
                <mat-label>Origin Location</mat-label>
                <input matInput formControlName="startLocation" placeholder="e.g. Central Hub">
                <mat-icon matSuffix>location_on</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Destination</mat-label>
                <input matInput formControlName="endLocation" placeholder="e.g. Port Authority">
                <mat-icon matSuffix>flag</mat-icon>
              </mat-form-field>
            </div>

            <div class="dispatch-btn-container">
              <button mat-raised-button class="btn-primary" type="submit" [disabled]="dispatchForm.invalid">
                <mat-icon>send</mat-icon>
                <span>Authorize & Dispatch</span>
              </button>
            </div>
          </form>
        </div>

        <div class="active-trips-card glass-card">
           <div class="card-header">
             <h3>Real-time Active Trips</h3>
           </div>
           <div class="active-trip-list">
              <div class="active-trip-item" *ngFor="let trip of activeTrips">
                 <div class="trip-icon">🚛</div>
                 <div class="trip-info">
                    <div class="trip-path">{{trip.startLocation}} → {{trip.endLocation}}</div>
                    <div class="trip-meta">{{trip.vehiclePlate}} · {{trip.driverName}}</div>
                 </div>
                 <div class="status-pill status-ontrip">En Route</div>
              </div>
              <div *ngIf="activeTrips.length === 0" class="empty-status">
                 <mat-icon>map</mat-icon>
                 <p>No active missions found</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { animation: fadeIn 0.4s ease-out; }
    .list-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
    .header-info h1 { margin: 0 0 4px; font-size: 1.75rem; }
    .header-info p { margin: 0; color: #64748b; font-size: 0.95rem; }

    .dispatch-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
    .dispatch-form-card { padding: 32px; }
    .card-header h3 { margin: 0 0 24px; font-size: 1.1rem; color: #f8fafc; }
    
    .premium-form { display: flex; flex-direction: column; gap: 8px; }
    .form-row-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    
    .dispatch-btn-container { margin-top: 24px; }
    .btn-primary { padding: 24px !important; width: 100%; font-size: 1rem !important; }

    .active-trips-card { padding: 24px; }
    .active-trip-list { display: flex; flex-direction: column; gap: 16px; }
    .active-trip-item { 
      padding: 16px; 
      background: rgba(255,255,255,0.03); 
      border-radius: 12px; 
      display: flex; 
      align-items: center; 
      gap: 16px;
      border: 1px solid rgba(255,255,255,0.05);
    }
    .trip-icon { font-size: 1.5rem; }
    .trip-info { flex: 1; }
    .trip-path { font-size: 0.9rem; font-weight: 600; color: #f8fafc; }
    .trip-meta { font-size: 0.75rem; color: #64748b; }
    .empty-status { padding: 48px; text-align: center; color: #64748b; opacity: 0.5; }
    .empty-status mat-icon { font-size: 32px; width: 32px; height: 32px; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class TripDispatchComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  dispatchForm = this.fb.group({
    vehicleId: [null, Validators.required],
    driverId: [null, Validators.required],
    cargoWeight: [0, [Validators.required, Validators.min(1)]],
    startLocation: ['', Validators.required],
    endLocation: ['', Validators.required],
    revenue: [0, Validators.required]
  });

  availableVehicles: any[] = [];
  availableDrivers: any[] = [];
  activeTrips: any[] = [];

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.http.get<any[]>('http://localhost:5104/api/vehicles/available').subscribe(data => this.availableVehicles = data);
    this.http.get<any[]>('http://localhost:5104/api/drivers/available').subscribe(data => this.availableDrivers = data);
    this.http.get<any[]>('http://localhost:5104/api/trips/active').subscribe(data => this.activeTrips = data);
  }

  onSubmit() {
    if (this.dispatchForm.valid) {
      this.http.post('http://localhost:5104/api/trips/dispatch', this.dispatchForm.value).subscribe({
        next: () => {
          this.dispatchForm.reset();
          this.refreshData();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
