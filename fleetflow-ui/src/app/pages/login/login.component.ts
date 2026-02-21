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
  selector: 'app-login',
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
    <div class="login-page">
      <div class="login-card glass-card">
        <div class="login-header">
<<<<<<< HEAD
          <div class="brand">FleetFlow</div>
          <h1>Sign in</h1>
          <p>Use your account to continue</p>
=======
          <div class="brand">Fleet<span>Flow</span></div>
          <h1>Welcome Back</h1>
          <p>Login to manage your fleet operations</p>
>>>>>>> 2b0ca3006f03b67a707c6508bd02df5a5c3092c7
        </div>

        <form
          [formGroup]="loginForm"
          (ngSubmit)="onSubmit()"
          class="login-form"
        >
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input
              matInput
              type="email"
              formControlName="email"
              placeholder="admin@fleetflow.com"
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
            class="btn-primary login-btn"
            type="submit"
            [disabled]="loginForm.invalid"
          >
            Sign In
          </button>

          <button
            mat-button
            type="button"
            class="switch-btn"
            (click)="goToRegister()"
          >
            Create new account
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
      .login-page {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-main);
        padding: 16px;
      }
      .login-card {
        width: 100%;
        max-width: 420px;
        padding: 32px;
      }
      .login-header {
        text-align: center;
        margin-bottom: 24px;
      }
      .brand {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 12px;
      }
      .login-header h1 {
        font-size: 1.25rem;
        margin: 0 0 8px;
        color: var(--text-primary);
      }
      .login-header p {
        color: var(--text-muted);
        margin: 0;
      }
      .login-form {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .full-width {
        width: 100%;
      }
      .login-btn {
        width: 100%;
        margin-top: 12px;
      }
      .switch-btn {
        width: 100%;
        color: var(--text-secondary);
      }
      .error-container {
        margin-top: 16px;
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
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  hidePassword = true;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.errorMessage = '';
      const { email, password } = this.loginForm.value;
      this.authService.login(email!, password!).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: () =>
          (this.errorMessage =
            'Authentication failed. Please check your credentials.'),
      });
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
