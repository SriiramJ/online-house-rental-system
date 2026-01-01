import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { AuthStateService } from '../../core/services/auth-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
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
    private authService: AuthService,
    private authState: AuthStateService
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
        if (response.success && response.data) {
          // Set token in auth state service
          this.authState.setToken(response.data.token);
          // Navigate to dashboard
          this.router.navigate(['/dashboard']);
        } else {
          this.error = response.error?.message || 'Login failed';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}