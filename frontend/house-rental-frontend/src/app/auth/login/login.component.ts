import { Component, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { AuthStateService } from '../../core/services/auth-state.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  error = '';
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private authState: AuthStateService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, this.gmailValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  gmailValidator(control: any) {
    const email = control.value;
    if (email && !email.endsWith('@gmail.com')) {
      return { gmailRequired: true };
    }
    return null;
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
      email: this.email?.value?.toLowerCase().trim(),
      password: this.password?.value,
      rememberMe: this.loginForm.get('rememberMe')?.value || false
    };

    this.authService.login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success && response.data) {
            this.authState.setToken(response.data.token);
            
            // Navigate based on role
            const redirectUrl = response.data.user.role === 'OWNER' 
              ? '/owner/dashboard' 
              : '/dashboard';
            this.router.navigate([redirectUrl]);
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Login failed. Please try again.';
        }
      });
  }

  // Demo login methods
  loginAsTenant() {
    this.loginForm.patchValue({
      email: 'tenant@test.com',
      password: 'Test@123'
    });
  }

  loginAsOwner() {
    this.loginForm.patchValue({
      email: 'owner@test.com',
      password: 'Test@123'
    });
  }
}