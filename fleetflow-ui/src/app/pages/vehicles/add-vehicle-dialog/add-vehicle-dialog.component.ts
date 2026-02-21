import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VehiclesService } from '../../../services/vehicles.service';

@Component({
  selector: 'app-add-vehicle-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{data ? 'Edit Vehicle' : 'Add New Vehicle'}}</h2>
    <mat-dialog-content>
      <form [formGroup]="vehicleForm" class="premium-form">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Model Name</mat-label>
            <input matInput formControlName="model" placeholder="e.g. Scania R500">
            <mat-icon matSuffix>local_shipping</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>License Plate</mat-label>
            <input matInput formControlName="licensePlate" placeholder="e.g. ABC-1234">
            <mat-icon matSuffix>subtitles</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row-grid">
          <mat-form-field appearance="outline">
            <mat-label>Max Capacity (kg)</mat-label>
            <input matInput type="number" formControlName="maxCapacityKg">
            <mat-icon matSuffix>weight</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Acquisition Cost ($)</mat-label>
            <input matInput type="number" formControlName="acquisitionCost">
            <mat-icon matSuffix>payments</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Initial Odometer Reading (km)</mat-label>
            <input matInput type="number" formControlName="odometer">
            <mat-icon matSuffix>speed</mat-icon>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button class="cancel-btn" (click)="onCancel()">Discard</button>
      <button mat-raised-button class="btn-primary" [disabled]="vehicleForm.invalid" (click)="onSave()">
        {{data ? 'Update Registry' : 'Register Vehicle'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .premium-form { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
    .form-row-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .cancel-btn { color: var(--text-muted); margin-right: 8px; }
    
    @media (max-width: 480px) {
      .form-row-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AddVehicleDialogComponent {
  private fb = inject(FormBuilder);
  private vehiclesService = inject(VehiclesService);
  private dialogRef = inject(MatDialogRef<AddVehicleDialogComponent>);
  public data = inject(MAT_DIALOG_DATA, { optional: true });

  ngOnInit() {
    if (this.data) {
      this.vehicleForm.patchValue({
        ...this.data,
        model: this.data.model || this.data.Model,
        licensePlate: this.data.licensePlate || this.data.LicensePlate,
        maxCapacityKg: this.data.maxCapacityKg || this.data.MaxCapacityKg,
        acquisitionCost: this.data.acquisitionCost || this.data.AcquisitionCost,
        odometer: this.data.odometer || this.data.Odometer
      });
    }
  }

  vehicleForm = this.fb.group({
    model: ['', Validators.required],
    licensePlate: ['', Validators.required],
    maxCapacityKg: [0, [Validators.required, Validators.min(1)]],
    acquisitionCost: [0, [Validators.required, Validators.min(0)]],
    odometer: [0, [Validators.required, Validators.min(0)]]
  });

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.vehicleForm.valid) {
      const vehicleId = this.data?.id || this.data?.Id;
      if (this.data && vehicleId) {
        this.vehiclesService.update(vehicleId, this.vehicleForm.value).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error(err)
        });
      } else {
        this.vehiclesService.create(this.vehicleForm.value).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error(err)
        });
      }
    }
  }
}
