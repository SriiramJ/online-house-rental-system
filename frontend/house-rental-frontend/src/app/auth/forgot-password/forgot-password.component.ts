import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
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
        <p>Enter your email address and we'll send you a link to reset your password.</p>
      </div>

      <div class="auth-form">
        <div *ngIf="message" [class]="messageType === 'success' ? 'success-message' : 'error-message'">
          <span>{{ messageType === 'success' ? '✅' : '⚠️' }}</span>
          <div>{{ message }}</div>
        </div>

        <form [formGroup]="forgotForm" (ngSubmit)="handleSubmit()" *ngIf="!submitted">
          <div class="form-group">
            <label for="email">Email Address</label>
            <div class="input-group">
              <span class="input-icon">📧</span>
              <input
                type="email"
                id="email"
                formControlName="email"
                placeholder="john@gmail.com"
              />
            </div>
            <div *ngIf="email?.invalid && email?.touched" class="field-error">
              <span *ngIf="email?.errors?.['required']">Email is required</span>
              <span *ngIf="email?.errors?.['gmailRequired']">Only Gmail addresses (@gmail.com) are accepted</span>
            </div>
          </div>

          <button type="submit" [disabled]="loading || forgotForm.invalid" class="submit-btn">
            <div *ngIf="loading" class="spinner"></div>
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>

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
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;
  submitted = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, this.gmailValidator]]
    });
  }

  gmailValidator(control: any) {
    const email = control.value;
    if (email && !email.endsWith('@gmail.com')) {
      return { gmailRequired: true };
    }
    return null;
  }

  get email() {
    return this.forgotForm.get('email');
  }

  handleSubmit() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.message = '';

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      this.loading = false;
      this.message = 'Request timed out. Please try again.';
      this.messageType = 'error';
    }, 10000); // 10 second timeout

    this.authService.forgotPassword(this.email?.value).subscribe({
      next: (response) => {
        clearTimeout(timeout);
        this.loading = false;
        this.submitted = true;
        this.message = response.message || 'Password reset instructions sent to your email';
        this.messageType = 'success';
      },
      error: (error) => {
        clearTimeout(timeout);
        this.loading = false;
        this.message = error.error?.message || 'Failed to send reset email';
        this.messageType = 'error';
      }
    });
  }
}