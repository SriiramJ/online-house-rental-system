import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  role: 'tenant' | 'owner' = 'tenant';
  loading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
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

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

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
      name: this.name?.value,
      email: this.email?.value,
      phone: this.phone?.value,
      password: this.password?.value,
      role: this.role.toUpperCase() as 'TENANT' | 'OWNER'
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          // Navigate based on role
          if (this.role === 'owner') {
            this.router.navigate(['/owner/dashboard']);
          } else {
            this.router.navigate(['/properties']);
          }
        } else {
          // Handle specific error codes
          if (response.error?.code === 'USER_EXISTS') {
            this.registerForm.get('email')?.setErrors({ userExists: true });
          } else {
            // Show general error message
            alert(response.error?.message || 'Registration failed');
          }
        }
      },
      error: (error) => {
        this.loading = false;
        alert(error.error?.error?.message || 'An error occurred during registration');
      }
    });
  }
}