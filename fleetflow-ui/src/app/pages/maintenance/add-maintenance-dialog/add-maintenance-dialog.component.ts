import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MaintenanceService } from '../../../services/maintenance.service';
import { VehiclesService } from '../../../services/vehicles.service';

@Component({
    selector: 'app-add-maintenance-dialog',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
        MatInputModule, MatButtonModule, MatIconModule, MatSelectModule
    ],
    template: `
    <h2 mat-dialog-title>Schedule Maintenance</h2>
    <mat-dialog-content>
      <form [formGroup]="maintForm" class="premium-form">
        <mat-form-field appearance="outline">
          <mat-label>Select Vehicle</mat-label>
          <mat-select formControlName="vehicleId">
            <mat-option *ngFor="let v of vehicles" [value]="v.id || v.Id">
              {{v.licensePlate || v.LicensePlate}} ({{v.model || v.Model}})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Service Description</mat-label>
          <textarea matInput formControlName="description" placeholder="Describe the service needed..."></textarea>
          <mat-icon matSuffix>description</mat-icon>
        </mat-form-field>

        <div class="form-row-grid">
          <mat-form-field appearance="outline">
            <mat-label>Estimated Cost ($)</mat-label>
            <input matInput type="number" formControlName="cost">
            <mat-icon matSuffix>payments</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Service Date</mat-label>
            <input matInput type="date" formControlName="serviceDate">
            <mat-icon matSuffix>event</mat-icon>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" [disabled]="maintForm.invalid" (click)="onSave()">Schedule</button>
    </mat-dialog-actions>
  `,
    styles: [`
    .premium-form { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
    .form-row-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  `]
})
export class AddMaintenanceDialogComponent implements OnInit {
    private fb = inject(FormBuilder);
    private maintenanceService = inject(MaintenanceService);
    private vehiclesService = inject(VehiclesService);
    public dialogRef = inject(MatDialogRef<AddMaintenanceDialogComponent>);
    public data = inject(MAT_DIALOG_DATA, { optional: true });

    vehicles: any[] = [];
    maintForm = this.fb.group({
        vehicleId: [null as any, Validators.required],
        description: ['', Validators.required],
        cost: [0, [Validators.required, Validators.min(0)]],
        serviceDate: [new Date().toISOString().split('T')[0], Validators.required]
    });

    ngOnInit() {
        this.vehiclesService.getAll().subscribe(data => this.vehicles = data);
        if (this.data) this.maintForm.patchValue(this.data);
    }

    onSave() {
        if (this.maintForm.valid) {
            this.maintenanceService.create(this.maintForm.value).subscribe({
                next: () => this.dialogRef.close(true),
                error: (err) => console.error(err)
            });
        }
    }
}
