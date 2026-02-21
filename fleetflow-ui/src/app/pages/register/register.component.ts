import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="register-page">
      <div class="register-card glass-card">
        <div class="register-header">
          <div class="brand">FleetFlow</div>
          <h1>Create account</h1>
          <p>Register with name, email and password</p>
        </div>

        <form
          [formGroup]="registerForm"
          (ngSubmit)="onSubmit()"
          class="register-form"
        >
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Name</mat-label>
            <input
              matInput
              type="text"
              formControlName="name"
              placeholder="Your name"
            />
            <mat-icon matPrefix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input
              matInput
              type="email"
              formControlName="email"
              placeholder="you@example.com"
            />
            <mat-icon matPrefix>email</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input
              matInput
              [type]="hidePassword ? 'password' : 'text'"
              formControlName="password"
            />
            <mat-icon matPrefix>lock</mat-icon>
            <button
              mat-icon-button
              matSuffix
              (click)="hidePassword = !hidePassword"
              type="button"
            >
              <mat-icon>{{
                hidePassword ? 'visibility_off' : 'visibility'
              }}</mat-icon>
            </button>
          </mat-form-field>

          <button
            mat-raised-button
            class="btn-primary register-btn"
            type="submit"
            [disabled]="registerForm.invalid || isSubmitting"
          >
            {{ isSubmitting ? 'Creating...' : 'Create account' }}
          </button>

          <button
            mat-button
            type="button"
            class="switch-btn"
            (click)="goToLogin()"
          >
            Already have an account? Sign in
          </button>

          <div *ngIf="errorMessage" class="error-container">
            <mat-icon>error_outline</mat-icon>
            <span>{{ errorMessage }}</span>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .register-page {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-main);
        padding: 16px;
      }
      .register-card {
        width: 100%;
        max-width: 420px;
        padding: 32px;
      }
      .register-header {
        text-align: center;
        margin-bottom: 24px;
      }
      .brand {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 12px;
      }
      .register-header h1 {
        font-size: 1.25rem;
        margin: 0 0 8px;
        color: var(--text-primary);
      }
      .register-header p {
        color: var(--text-muted);
        margin: 0;
      }
      .register-form {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .full-width {
        width: 100%;
      }
      .register-btn {
        width: 100%;
        margin-top: 12px;
      }
      .switch-btn {
        width: 100%;
        color: var(--text-secondary);
      }
      .error-container {
        margin-top: 12px;
        padding: 12px;
        background: rgba(244, 63, 94, 0.1);
        border: 1px solid rgba(244, 63, 94, 0.2);
        border-radius: 8px;
        color: var(--secondary);
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.85rem;
      }
    `,
  ],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  hidePassword = true;
  isSubmitting = false;
  errorMessage = '';

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.registerForm.valid && !this.isSubmitting) {
      this.errorMessage = '';
      this.isSubmitting = true;
      const { name, email, password } = this.registerForm.value;
      this.authService.register(name!, email!, password!).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage =
            err?.error || 'Registration failed. Please try again.';
        },
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
