import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="login-container fade-in">
      <mat-card class="login-card glass-card">
        <mat-card-header>
          <mat-card-title class="gradient-text">
            <mat-icon>home</mat-icon>
            Welcome Back
          </mat-card-title>
          <mat-card-subtitle>Sign in to your account</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form (ngSubmit)="onLogin()" class="login-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="credentials.email" name="email" required>
              <mat-icon matSuffix>email</mat-icon>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" [(ngModel)]="credentials.password" name="password" required>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
            </mat-form-field>
            
            <button mat-raised-button color="primary" type="submit" class="login-btn full-width">
              <mat-icon>login</mat-icon>
              Sign In
            </button>
          </form>
          
          <div *ngIf="message" class="message" [ngClass]="messageClass">
            <mat-icon>{{messageClass === 'success' ? 'check_circle' : 'error'}}</mat-icon>
            {{ message }}
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 20px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .login-btn {
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      margin-top: 16px;
    }
    
    .message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border-radius: 8px;
      margin-top: 16px;
      font-weight: 500;
    }
    
    .success {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    
    .error {
      background: rgba(239, 68, 68, 0.1);
      color: #dc2626;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
    
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 24px;
      font-weight: 600;
    }
    
    mat-card-subtitle {
      color: #64748b;
      margin-top: 4px;
    }
  `]
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  
  message = '';
  messageClass = '';
  hidePassword = true;

  constructor(private apiService: ApiService) {}

  onLogin() {
    this.apiService.login(this.credentials).subscribe({
      next: (response) => {
        this.message = 'Login successful!';
        this.messageClass = 'success';
        console.log('Login response:', response);
      },
      error: (error) => {
        this.message = error.error?.message || 'Login failed. Please try again.';
        this.messageClass = 'error';
        console.error('Login error:', error);
      }
    });
  }
}