import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

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
    private authService: AuthService,
    private toast: ToastService
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

    const formValue = this.registerForm.value;
    const userData = {
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone,
      password: formValue.password,
      role: this.role.toUpperCase() as 'TENANT' | 'OWNER'
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Registration response:', response);
        
        if (response.success) {
          this.toast.success('Registration Successful!', 'Please login to continue.');
          this.router.navigate(['/auth/login']);
        } else {
          this.toast.error('Registration Failed', response.message || 'Registration failed');
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Registration error:', error);
        console.error('Error details:', error.error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        
        let errorMessage = 'An error occurred during registration';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.toast.error('Registration Failed', errorMessage);
      }
    });
  }
}