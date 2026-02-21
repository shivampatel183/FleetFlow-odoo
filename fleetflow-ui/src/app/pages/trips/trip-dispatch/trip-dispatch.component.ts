import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { VehiclesService } from '../../../services/vehicles.service';
import { DriversService } from '../../../services/drivers.service';
import { TripsService } from '../../../services/trips.service';

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
          <h1>Logistics Command Center</h1>
          <p>Strategic authorization and real-time fleet deployment oversight</p>
        </div>
      </div>

      <div class="dispatch-layout">
        <div class="command-section glass-card">
          <div class="card-header">
            <h3><mat-icon>verified_user</mat-icon> New Mission Authorization</h3>
          </div>
          
          <form [formGroup]="dispatchForm" (ngSubmit)="onSubmit()" class="premium-form">
            <div class="form-grid">
              <div class="form-group full-width">
                <mat-form-field appearance="outline">
                  <mat-label>Designated Vehicle</mat-label>
                  <mat-select formControlName="vehicleId">
                    <mat-option *ngFor="let v of availableVehicles" [value]="v.id">
                      <div class="option-content">
                        <span class="plate">{{v.licensePlate}}</span>
                        <span class="model">{{v.model}}</span>
                      </div>
                    </mat-option>
                  </mat-select>
                  <mat-icon matSuffix>local_shipping</mat-icon>
                </mat-form-field>
              </div>

              <div class="form-group full-width">
                <mat-form-field appearance="outline">
                  <mat-label>Assigned Operator</mat-label>
                  <mat-select formControlName="driverId">
                    <mat-option *ngFor="let d of availableDrivers" [value]="d.id">
                      {{d.name}}
                    </mat-option>
                  </mat-select>
                  <mat-icon matSuffix>person</mat-icon>
                </mat-form-field>
              </div>

              <div class="form-group">
                <mat-form-field appearance="outline">
                  <mat-label>Cargo Payload (kg)</mat-label>
                  <input matInput type="number" formControlName="cargoWeight">
                  <mat-icon matSuffix>monitor_weight</mat-icon>
                </mat-form-field>
              </div>
              
              <div class="form-group">
                <mat-form-field appearance="outline">
                  <mat-label>Est. Mission Revenue ($)</mat-label>
                  <input matInput type="number" formControlName="revenue">
                  <mat-icon matSuffix>payments</mat-icon>
                </mat-form-field>
              </div>

              <div class="form-group">
                <mat-form-field appearance="outline">
                  <mat-label>Origin Point</mat-label>
                  <input matInput formControlName="startLocation" placeholder="Departure Hub">
                  <mat-icon matSuffix>location_on</mat-icon>
                </mat-form-field>
              </div>

              <div class="form-group">
                <mat-form-field appearance="outline">
                  <mat-label>Final Destination</mat-label>
                  <input matInput formControlName="endLocation" placeholder="Arrival Terminal">
                  <mat-icon matSuffix>flag</mat-icon>
                </mat-form-field>
              </div>
            </div>

            <div class="action-footer">
              <button mat-flat-button class="btn-dispatch" type="submit" [disabled]="dispatchForm.invalid || isSubmitting">
                <mat-icon *ngIf="!isSubmitting">bolt</mat-icon>
                <span *ngIf="!isSubmitting">Authorize & Dispatch Mission</span>
                <span *ngIf="isSubmitting">Processing Authorization...</span>
              </button>
            </div>
          </form>
        </div>

        <div class="monitor-section glass-card">
           <div class="card-header">
             <h3><mat-icon>sensors</mat-icon> Live Deployment Monitor</h3>
           </div>
           <div class="active-trip-list">
              <div class="active-trip-item" *ngFor="let trip of activeTrips">
                 <div class="trip-visual">
                    <div class="pulse-ring"></div>
                    <mat-icon>navigation</mat-icon>
                 </div>
                 <div class="trip-details">
                    <div class="trip-route">{{trip.startLocation}} <mat-icon>east</mat-icon> {{trip.endLocation}}</div>
                    <div class="trip-assets">
                      <span class="asset-pill"><mat-icon>local_shipping</mat-icon> {{trip.vehiclePlate}}</span>
                      <span class="asset-pill"><mat-icon>person</mat-icon> {{trip.driverName}}</span>
                    </div>
                 </div>
                 <div class="trip-actions">
                   <div class="trip-badge">ACTIVE</div>
                   <button
                     mat-stroked-button
                     class="btn-complete"
                     [disabled]="completingTripId === getTripId(trip)"
                     (click)="completeTrip(trip)"
                   >
                     {{ completingTripId === getTripId(trip) ? 'Completing...' : 'Complete Trip' }}
                   </button>
                 </div>
              </div>
              
              <div *ngIf="activeTrips.length === 0" class="monitor-empty">
                 <mat-icon>satellite_alt</mat-icon>
                 <p>No active missions on radar</p>
                 <span>Authorize a mission to begin tracking</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { animation: fadeIn 0.4s ease-out; }
    .list-header { margin-bottom: 32px; }
    .header-info h1 { margin: 0 0 4px; font-size: 2rem; color: var(--text-primary); font-weight: 800; }
    .header-info p { margin: 0; color: var(--text-muted); font-size: 1rem; }

    .dispatch-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(420px, 1fr);
      gap: 24px;
      align-items: start;
    }
    .dispatch-layout > * { min-width: 0; }
    
    .command-section, .monitor-section { padding: 32px; height: fit-content; }
    .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
    .card-header h3 { margin: 0; font-size: 1.2rem; color: var(--text-primary); display: flex; align-items: center; gap: 10px; }
    .card-header mat-icon { color: var(--text-primary); }
    
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .full-width { grid-column: span 2; }
    
    .option-content { display: flex; flex-direction: column; }
    .plate { font-weight: 700; color: var(--text-primary); }
    .model { font-size: 0.75rem; color: #94a3b8; }
    
    .action-footer { margin-top: 32px; }
    .btn-dispatch { 
      padding: 28px !important; 
      width: 100%; 
      font-size: 1.05rem !important; 
      font-weight: 700 !important; 
      background: linear-gradient(135deg, #6366f1, #4f46e5) !important;
      color: white !important;
      border-radius: 14px !important;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3) !important;
    }
    .btn-dispatch:disabled { background: rgba(255,255,255,0.05) !important; opacity: 0.5; }

    .active-trip-list { display: flex; flex-direction: column; gap: 14px; max-height: 70vh; overflow-y: auto; }
    .active-trip-item { 
      padding: 16px; 
      background: rgba(255,255,255,0.02); 
      border-radius: 16px; 
      display: flex; 
      align-items: center; 
      gap: 14px;
      border: 1px solid rgba(255,255,255,0.04);
      transition: all 0.3s ease;
    }
    .active-trip-item:hover { background: rgba(255,255,255,0.04); transform: translateX(4px); }
    
    .trip-visual { position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: rgba(99, 102, 241, 0.1); border-radius: 12px; }
    .trip-visual mat-icon { color: #6366f1; font-size: 20px; transform: rotate(45deg); }
    .pulse-ring { position: absolute; width: 100%; height: 100%; border: 2px solid #6366f1; border-radius: 12px; animation: pulse 2s infinite; opacity: 0; }
    
    @keyframes pulse { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.4); opacity: 0; } }

    .trip-details { flex: 1; }
    .trip-route { font-size: 1rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .trip-route mat-icon { font-size: 16px; width: 16px; height: 16px; color: #94a3b8; }
    
    .trip-assets { display: flex; gap: 8px; flex-wrap: wrap; }
    .asset-pill { font-size: 0.75rem; color: var(--text-secondary); background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 6px; display: flex; align-items: center; gap: 4px; }
    .asset-pill mat-icon { font-size: 14px; width: 14px; height: 14px; color: #94a3b8; }
    
    .trip-badge { font-size: 0.65rem; font-weight: 800; color: #4ade80; padding: 4px 8px; border: 1px solid rgba(74, 222, 128, 0.2); border-radius: 6px; letter-spacing: 0.05em; }
    .trip-actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; flex-shrink: 0; }
    .btn-complete {
      color: var(--text-primary) !important;
      border-color: var(--border-color) !important;
      background: rgba(255, 255, 255, 0.04) !important;
      font-size: 0.75rem;
      white-space: nowrap;
    }

    .monitor-empty { padding: 64px 24px; text-align: center; color: #64748b; }
    .monitor-empty mat-icon { font-size: 48px; width: 48px; height: 48px; color: #1e293b; margin-bottom: 16px; }
    .monitor-empty p { margin: 0 0 4px; font-weight: 600; color: #94a3b8; }
    .monitor-empty span { font-size: 0.8rem; opacity: 0.6; }

    @media (max-width: 1500px) {
      .dispatch-layout { grid-template-columns: minmax(0, 1.15fr) minmax(360px, 1fr); }
    }

    @media (max-width: 1200px) {
      .dispatch-layout { grid-template-columns: 1fr; }
      .monitor-section { order: 2; }
      .active-trip-list { max-height: none; }
    }

    @media (max-width: 900px) {
      .command-section, .monitor-section { padding: 20px; }
      .form-grid { grid-template-columns: 1fr; gap: 12px; }
      .full-width { grid-column: span 1; }
      .header-info h1 { font-size: 1.5rem; }
      .header-info p { font-size: 0.9rem; }
      .btn-dispatch { padding: 16px !important; font-size: 0.95rem !important; }
      .active-trip-item { align-items: flex-start; flex-wrap: wrap; }
      .trip-actions { width: 100%; align-items: stretch; }
      .btn-complete { width: 100%; }
    }
  `]
})
export class TripDispatchComponent implements OnInit {
  private fb = inject(FormBuilder);
  private vehiclesService = inject(VehiclesService);
  private driversService = inject(DriversService);
  private tripsService = inject(TripsService);

  dispatchForm = this.fb.group({
    vehicleId: [null, Validators.required],
    driverId: [null, Validators.required],
    cargoWeight: [0, [Validators.required, Validators.min(1)]],
    startLocation: ['', Validators.required],
    endLocation: ['', Validators.required],
    revenue: [0, [Validators.required, Validators.min(0)]]
  });

  availableVehicles: any[] = [];
  availableDrivers: any[] = [];
  activeTrips: any[] = [];
  isSubmitting = false;
  completingTripId: number | null = null;

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.vehiclesService.getAvailable().subscribe(data => this.availableVehicles = data);
    this.driversService.getAvailable().subscribe(data => this.availableDrivers = data);
    this.tripsService.getActive().subscribe(data => this.activeTrips = data);
  }

  onSubmit() {
    if (this.dispatchForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.tripsService.dispatch(this.dispatchForm.value).subscribe({
        next: () => {
          this.dispatchForm.reset({
            cargoWeight: 0,
            revenue: 0,
            startLocation: '',
            endLocation: ''
          });
          this.refreshData();
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
    }
  }

  getTripId(trip: any): number {
    return Number(trip?.id ?? trip?.Id ?? 0);
  }

  completeTrip(trip: any) {
    const tripId = this.getTripId(trip);
    if (!tripId) {
      alert('Trip ID is missing. Cannot complete this trip.');
      return;
    }

    const endOdometerInput = window.prompt('Enter end odometer (km):');
    if (endOdometerInput === null) {
      return;
    }

    const endOdometer = Number(endOdometerInput);
    if (!Number.isFinite(endOdometer) || endOdometer <= 0) {
      alert('Please enter a valid odometer value.');
      return;
    }

    this.completingTripId = tripId;
    this.tripsService.complete(tripId, endOdometer).subscribe({
      next: () => {
        this.completingTripId = null;
        this.refreshData();
      },
      error: (err) => {
        this.completingTripId = null;
        console.error(err);
        alert(typeof err?.error === 'string' ? err.error : 'Failed to complete trip.');
      }
    });
  }
}
