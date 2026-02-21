import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FuelService } from '../../../services/fuel.service';
import { VehiclesService } from '../../../services/vehicles.service';

@Component({
    selector: 'app-add-fuel-dialog',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
        MatInputModule, MatButtonModule, MatIconModule, MatSelectModule
    ],
    template: `
    <h2 mat-dialog-title>Log Fuel Entry</h2>
    <mat-dialog-content>
      <form [formGroup]="fuelForm" class="premium-form">
        <mat-form-field appearance="outline">
          <mat-label>Select Vehicle</mat-label>
          <mat-select formControlName="vehicleId">
            <mat-option *ngFor="let v of vehicles" [value]="v.id || v.Id">
              {{v.licensePlate || v.LicensePlate}} ({{v.model || v.Model}})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="form-row-grid">
          <mat-form-field appearance="outline">
            <mat-label>Liters</mat-label>
            <input matInput type="number" formControlName="liters">
            <mat-icon matSuffix>water_drop</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Total Cost ($)</mat-label>
            <input matInput type="number" formControlName="cost">
            <mat-icon matSuffix>payments</mat-icon>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Date</mat-label>
          <input matInput type="date" formControlName="date">
          <mat-icon matSuffix>event</mat-icon>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" [disabled]="fuelForm.invalid" (click)="onSave()">Save Entry</button>
    </mat-dialog-actions>
  `,
    styles: [`
    .premium-form { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
    .form-row-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  `]
})
export class AddFuelDialogComponent implements OnInit {
    private fb = inject(FormBuilder);
    private fuelService = inject(FuelService);
    private vehiclesService = inject(VehiclesService);
    public dialogRef = inject(MatDialogRef<AddFuelDialogComponent>);
    public data = inject(MAT_DIALOG_DATA, { optional: true });

    vehicles: any[] = [];
    fuelForm = this.fb.group({
        vehicleId: [null as any, Validators.required],
        liters: [0, [Validators.required, Validators.min(0.1)]],
        cost: [0, [Validators.required, Validators.min(0)]],
        date: [new Date().toISOString().split('T')[0], Validators.required]
    });

    ngOnInit() {
        this.vehiclesService.getAll().subscribe(data => this.vehicles = data);
        if (this.data) this.fuelForm.patchValue(this.data);
    }

    onSave() {
        if (this.fuelForm.valid) {
            this.fuelService.create(this.fuelForm.value).subscribe({
                next: () => this.dialogRef.close(true),
                error: (err) => console.error(err)
            });
        }
    }
}
