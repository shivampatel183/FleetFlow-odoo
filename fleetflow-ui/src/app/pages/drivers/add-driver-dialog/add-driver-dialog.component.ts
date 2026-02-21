import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DriversService } from '../../../services/drivers.service';

@Component({
  selector: 'app-add-driver-dialog',
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
    <h2 mat-dialog-title>{{data ? 'Edit Driver Details' : 'Enroll New Driver'}}</h2>
    <mat-dialog-content>
      <form [formGroup]="driverForm" class="premium-form">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="name" placeholder="e.g. John Doe">
            <mat-icon matSuffix>person</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>License Number</mat-label>
            <input matInput formControlName="licenseNumber" placeholder="e.g. DL-12345678">
            <mat-icon matSuffix>verified_user</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>License Expiry Date</mat-label>
            <input matInput type="date" formControlName="licenseExpiryDate">
            <mat-icon matSuffix>event</mat-icon>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button class="cancel-btn" (click)="onCancel()">Discard</button>
      <button mat-raised-button class="btn-primary" [disabled]="driverForm.invalid" (click)="onSave()">
        {{data ? 'Update Enrollment' : 'Complete Enrollment'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .premium-form { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
    .cancel-btn { color: var(--text-muted); margin-right: 8px; }
  `]
})
export class AddDriverDialogComponent {
  private fb = inject(FormBuilder);
  private driversService = inject(DriversService);
  private dialogRef = inject(MatDialogRef<AddDriverDialogComponent>);
  public data = inject(MAT_DIALOG_DATA, { optional: true });

  ngOnInit() {
    if (this.data) {
      // Format date for the input
      const expiryDate = this.data.licenseExpiryDate || this.data.LicenseExpiryDate;
      const formattedDate = expiryDate ? new Date(expiryDate).toISOString().split('T')[0] : '';
      this.driverForm.patchValue({
        ...this.data,
        licenseExpiryDate: formattedDate,
        name: this.data.name || this.data.Name,
        licenseNumber: this.data.licenseNumber || this.data.LicenseNumber
      });
    }
  }

  driverForm = this.fb.group({
    name: ['', Validators.required],
    licenseNumber: ['', Validators.required],
    licenseExpiryDate: ['', Validators.required]
  });

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.driverForm.valid) {
      const driverId = this.data?.id || this.data?.Id;
      if (this.data && driverId) {
        this.driversService.update(driverId, this.driverForm.value).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error(err)
        });
      } else {
        this.driversService.create(this.driverForm.value).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error(err)
        });
      }
    }
  }
}
