import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';
  loading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  handleSubmit() {
    this.error = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const credentials = {
      email: this.email?.value,
      password: this.password?.value
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          // Navigate based on user role
          const user = this.authService.getCurrentUser();
          if (user?.role === 'OWNER') {
            this.router.navigate(['/owner/dashboard']);
          } else {
            this.router.navigate(['/properties']);
          }
        } else {
          this.error = response.error?.message || 'Login failed';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.error?.message || 'An error occurred during login';
      }
    });
  }

  setDemoAccount(type: 'tenant' | 'owner') {
    if (type === 'tenant') {
      this.loginForm.patchValue({
        email: 'tenant@demo.com',
        password: 'demo123'
      });
    } else {
      this.loginForm.patchValue({
        email: 'owner@demo.com',
        password: 'demo123'
      });
    }
  }
}