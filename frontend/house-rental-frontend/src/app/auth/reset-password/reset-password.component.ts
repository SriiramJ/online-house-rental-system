import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-header">
        <div class="logo" routerLink="/">
          <span class="logo-icon">🏢</span>
          <span class="logo-text">RentEase</span>
        </div>
        <h2>Reset your password</h2>
        <p>Enter your new password below.</p>
      </div>

      <div class="auth-form">
        <div *ngIf="message" [class]="messageType === 'success' ? 'success-message' : 'error-message'">
          <span>{{ messageType === 'success' ? '✅' : '⚠️' }}</span>
          <div>{{ message }}</div>
        </div>

        <form [formGroup]="resetForm" (ngSubmit)="handleSubmit()" *ngIf="!submitted && token">
          <div class="form-group">
            <label for="password">New Password</label>
            <div class="input-group">
              <span class="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                formControlName="password"
                placeholder="Enter new password"
              />
            </div>
            <div *ngIf="password?.invalid && password?.touched" class="field-error">
              <span *ngIf="password?.errors?.['required']">Password is required</span>
              <div *ngIf="password?.errors && !password?.errors?.['required']" class="password-requirements">
                <div class="requirement-title">Password must contain:</div>
                <div class="requirement" [class.valid]="!password?.errors?.['minLength']">• At least 8 characters</div>
                <div class="requirement" [class.valid]="!password?.errors?.['upperCase']">• One uppercase letter (A-Z)</div>
                <div class="requirement" [class.valid]="!password?.errors?.['lowerCase']">• One lowercase letter (a-z)</div>
                <div class="requirement" [class.valid]="!password?.errors?.['specialChar']">• One special character (!@#$%^&*)</div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="input-group">
              <span class="input-icon">🔒</span>
              <input
                type="password"
                id="confirmPassword"
                formControlName="confirmPassword"
                placeholder="Confirm new password"
              />
            </div>
            <div *ngIf="confirmPassword?.invalid && confirmPassword?.touched" class="field-error">
              <span *ngIf="confirmPassword?.errors?.['required']">Please confirm your password</span>
              <span *ngIf="confirmPassword?.errors?.['mismatch']">Passwords do not match</span>
            </div>
          </div>

          <button type="submit" [disabled]="loading || resetForm.invalid" class="submit-btn">
            <div *ngIf="loading" class="spinner"></div>
            {{ loading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>

        <div *ngIf="!token" class="error-message">
          <span>⚠️</span>
          <div>Invalid or missing reset token. Please request a new password reset.</div>
        </div>

        <div class="back-link">
          <a routerLink="/auth/login">← Back to Sign In</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      background: #f9fafb;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 3rem 1rem;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      cursor: pointer;
    }

    .logo-icon {
      font-size: 3rem;
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: bold;
      color: #4f46e5;
    }

    h2 {
      font-size: 1.875rem;
      font-weight: bold;
      color: #111827;
      margin-bottom: 0.5rem;
    }

    p {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .auth-form {
      max-width: 28rem;
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    }

    .success-message, .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .success-message {
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }

    .error-message {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      color: #374151;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .input-group {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
    }

    input {
      width: 100%;
      padding: 0.5rem 1rem 0.5rem 2.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
    }

    input:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    .field-error {
      color: #dc2626;
      font-size: 0.875rem;
      margin-top: 0.25rem;

      .password-requirements {
        margin-top: 0.5rem;
        padding: 0.75rem;
        background: #fef2f2;
        border-radius: 0.375rem;
        border: 1px solid #fecaca;

        .requirement-title {
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #991b1b;
        }

        .requirement {
          font-size: 0.75rem;
          margin-bottom: 0.25rem;
          color: #dc2626;

          &.valid {
            color: #059669;
          }
        }
      }
    }

    .submit-btn {
      width: 100%;
      padding: 0.75rem 1rem;
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .submit-btn:hover:not(:disabled) {
      background: #3730a3;
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .spinner {
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 0.5rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .back-link {
      text-align: center;
      margin-top: 1.5rem;
    }

    .back-link a {
      color: #4f46e5;
      text-decoration: none;
      font-size: 0.875rem;
    }

    .back-link a:hover {
      color: #3730a3;
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  loading = false;
  submitted = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  token: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, this.passwordValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
  }

  passwordValidator(control: any) {
    const password = control.value;
    if (!password) return null;
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?\":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;
    
    const errors: any = {};
    if (!hasMinLength) errors.minLength = true;
    if (!hasUpperCase) errors.upperCase = true;
    if (!hasLowerCase) errors.lowerCase = true;
    if (!hasSpecialChar) errors.specialChar = true;
    
    return Object.keys(errors).length ? errors : null;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  get password() {
    return this.resetForm.get('password');
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
  }

  handleSubmit() {
    if (this.resetForm.invalid || !this.token) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.message = '';

    this.authService.resetPassword(this.token, this.password?.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.submitted = true;
        this.message = 'Password reset successful! You can now sign in with your new password.';
        this.messageType = 'success';
        
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (error) => {
        this.loading = false;
        this.message = error.error?.message || 'Failed to reset password';
        this.messageType = 'error';
      }
    });
  }
}