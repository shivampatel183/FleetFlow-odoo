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
    MatIconModule
  ],
  template: `
    <div class="login-page">
      <div class="background-decor">
        <div class="circle c1"></div>
        <div class="circle c2"></div>
      </div>
      
      <div class="login-card glass-card">
        <div class="login-header">
          <div class="brand">🚀 Fleet<span>Flow</span></div>
          <h1>Welcome Back</h1>
          <p>Login to manage your fleet operations</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Corporate Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="admin@fleetflow.com">
            <mat-icon matPrefix>email</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
          </mat-form-field>

          <div class="form-actions">
            <button mat-raised-button class="btn-primary login-btn" type="submit" [disabled]="loginForm.invalid">
              Sign In to Dashboard
            </button>
          </div>
          
          <div *ngIf="errorMessage" class="error-container">
            <mat-icon>error_outline</mat-icon>
            <span>{{ errorMessage }}</span>
          </div>
        </form>

        <div class="login-footer">
          <p>© 2026 FleetFlow Enterprise. All rights reserved.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0f172a;
      overflow: hidden;
      position: relative;
    }

    .background-decor .circle {
      position: absolute;
      filter: blur(80px);
      border-radius: 50%;
      z-index: 0;
    }
    .c1 { width: 400px; height: 400px; background: rgba(99, 102, 241, 0.15); top: -100px; right: -100px; }
    .c2 { width: 300px; height: 300px; background: rgba(244, 63, 94, 0.1); bottom: -50px; left: -50px; }

    .login-card {
      width: 100%;
      max-width: 440px;
      padding: 48px;
      z-index: 10;
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .login-header { text-align: center; margin-bottom: 40px; }
    .brand { font-size: 1.75rem; font-weight: 800; color: #f8fafc; margin-bottom: 24px; letter-spacing: -1px; }
    .brand span { color: #6366f1; }
    
    .login-header h1 { font-size: 1.5rem; margin: 0 0 8px; color: #f8fafc; }
    .login-header p { color: #94a3b8; font-size: 0.95rem; margin: 0; }

    .login-form { display: flex; flex-direction: column; gap: 8px; }
    .full-width { width: 100%; }
    
    ::ng-deep .mat-mdc-text-field-wrapper { background: rgba(255,255,255,0.03) !important; }
    
    .login-btn { 
      padding: 24px !important; 
      font-size: 1rem !important; 
      margin-top: 16px;
      width: 100%;
    }

    .error-container {
      margin-top: 20px;
      padding: 12px;
      background: rgba(244, 63, 94, 0.1);
      border: 1px solid rgba(244, 63, 94, 0.2);
      border-radius: 8px;
      color: #fb7185;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.85rem;
    }

    .login-footer { margin-top: 40px; text-align: center; }
    .login-footer p { font-size: 0.75rem; color: #64748b; margin: 0; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  hidePassword = true;

  loginForm = this.fb.group({
    email: ['admin@fleetflow.com', [Validators.required, Validators.email]],
    password: ['AdminPassword123', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.errorMessage = '';
      const { email, password } = this.loginForm.value;
      this.authService.login(email!, password!).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMessage = 'Authentication failed. Please check your credentials.';
          console.error(err);
        }
      });
    }
  }
}
