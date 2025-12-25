import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule],
  template: `
    <div class="register-container fade-in">
      <mat-card class="register-card glass-card">
        <mat-card-header>
          <mat-card-title class="gradient-text">
            <mat-icon>person_add</mat-icon>
            Create Account
          </mat-card-title>
          <mat-card-subtitle>Join RentEase today</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form (ngSubmit)="onRegister()" class="register-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <input matInput [(ngModel)]="userData.name" name="name" required>
              <mat-icon matSuffix>person</mat-icon>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="userData.email" name="email" required>
              <mat-icon matSuffix>email</mat-icon>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Phone</mat-label>
              <input matInput [(ngModel)]="userData.phone" name="phone">
              <mat-icon matSuffix>phone</mat-icon>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Role</mat-label>
              <mat-select [(ngModel)]="userData.role" name="role" required>
                <mat-option value="TENANT">Tenant</mat-option>
                <mat-option value="OWNER">Property Owner</mat-option>
              </mat-select>
              <mat-icon matSuffix>badge</mat-icon>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" [(ngModel)]="userData.password" name="password" required>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
            </mat-form-field>
            
            <button mat-raised-button color="primary" type="submit" class="register-btn full-width">
              <mat-icon>person_add</mat-icon>
              Create Account
            </button>
          </form>
          
          <div *ngIf="message" class="message" [ngClass]="messageClass">
            <mat-icon>{{messageClass === 'success' ? 'check_circle' : 'error'}}</mat-icon>
            {{ message }}
          </div>
          
          <div class="login-link">
            Already have an account? 
            <a routerLink="/login" class="gradient-text">Sign in</a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .register-card {
      width: 100%;
      max-width: 450px;
      padding: 20px;
    }
    
    .register-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 20px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .register-btn {
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
    
    .login-link {
      text-align: center;
      margin-top: 20px;
      color: #64748b;
    }
    
    .login-link a {
      text-decoration: none;
      font-weight: 500;
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
export class RegisterComponent {
  userData = {
    name: '',
    email: '',
    phone: '',
    role: 'TENANT',
    password: ''
  };
  
  message = '';
  messageClass = '';
  hidePassword = true;

  constructor(private apiService: ApiService) {}

  onRegister() {
    this.apiService.register(this.userData).subscribe({
      next: (response) => {
        this.message = 'Account created successfully!';
        this.messageClass = 'success';
        console.log('Register response:', response);
      },
      error: (error) => {
        this.message = error.error?.message || 'Registration failed. Please try again.';
        this.messageClass = 'error';
        console.error('Register error:', error);
      }
    });
  }
}