import { Component, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy {
  registerForm: FormGroup;
  role: 'tenant' | 'owner' = 'tenant';
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, this.gmailValidator]],
      phone: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, this.passwordValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
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

  passwordValidator(control: any) {
    const password = control.value;
    if (!password) return null;
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
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

  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get phone() { return this.registerForm.get('phone'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  setRole(role: 'tenant' | 'owner') {
    this.role = role;
  }

  handleSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const userData = {
      name: this.name?.value?.trim(),
      email: this.email?.value?.toLowerCase().trim(),
      phone: this.phone?.value || undefined,
      password: this.password?.value,
      role: this.role.toUpperCase() as 'TENANT' | 'OWNER'
    };

    this.authService.register(userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.toast.success('Registration Successful', 'Welcome to RentEase! Please log in to continue.');
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.loading = false;
          const errorMessage = error.error?.message || 'Registration failed';
          
          if (error.error?.code === 'EMAIL_EXISTS') {
            this.registerForm.get('email')?.setErrors({ userExists: true });
            this.toast.error('Email Already Registered', 'Please use a different email address.');
          } else {
            this.toast.error('Registration Failed', errorMessage);
          }
        }
      });
  }
}