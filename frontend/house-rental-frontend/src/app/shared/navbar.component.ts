import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatBadgeModule, MatDividerModule],
  template: `
    <mat-toolbar class="navbar glass-card">
      <div class="nav-container">
        <!-- Logo & Brand -->
        <div class="brand" routerLink="/">
          <mat-icon class="brand-icon">home</mat-icon>
          <span class="brand-text gradient-text">RentEase</span>
        </div>

        <!-- Navigation Links -->
        <nav class="nav-links" *ngIf="isLoggedIn">
          <!-- Tenant Navigation -->
          <ng-container *ngIf="userRole === 'TENANT'">
            <button mat-button routerLink="/properties" routerLinkActive="active">
              <mat-icon>search</mat-icon>
              Browse Properties
            </button>
            <button mat-button routerLink="/my-bookings" routerLinkActive="active">
              <mat-icon matBadge="3" matBadgeColor="accent">bookmark</mat-icon>
              My Bookings
            </button>
          </ng-container>

          <!-- Owner Navigation -->
          <ng-container *ngIf="userRole === 'OWNER'">
            <button mat-button routerLink="/properties" routerLinkActive="active">
              <mat-icon>apartment</mat-icon>
              Properties
            </button>
            <button mat-button routerLink="/owner/dashboard" routerLinkActive="active">
              <mat-icon matBadge="5" matBadgeColor="warn">dashboard</mat-icon>
              Dashboard
            </button>
            <button mat-button routerLink="/add-property" routerLinkActive="active">
              <mat-icon>add_home</mat-icon>
              Add Property
            </button>
          </ng-container>

          <!-- Admin Navigation -->
          <ng-container *ngIf="userRole === 'ADMIN'">
            <button mat-button routerLink="/admin/users" routerLinkActive="active">
              <mat-icon>people</mat-icon>
              Users
            </button>
            <button mat-button routerLink="/admin/properties" routerLinkActive="active">
              <mat-icon>business</mat-icon>
              All Properties
            </button>
            <button mat-button routerLink="/admin/analytics" routerLinkActive="active">
              <mat-icon>analytics</mat-icon>
              Analytics
            </button>
          </ng-container>
        </nav>

        <!-- User Menu -->
        <div class="user-section">
          <ng-container *ngIf="!isLoggedIn">
            <button mat-button routerLink="/login" class="login-btn">
              <mat-icon>login</mat-icon>
              Sign In
            </button>
            <button mat-raised-button color="primary" routerLink="/register" class="register-btn">
              <mat-icon>person_add</mat-icon>
              Sign Up
            </button>
          </ng-container>

          <ng-container *ngIf="isLoggedIn">
            <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-avatar">
              <mat-icon>account_circle</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu" class="user-menu">
              <div class="user-info">
                <div class="user-name">{{ userName }}</div>
                <div class="user-role">{{ userRole }}</div>
              </div>
              <mat-divider></mat-divider>
              <button mat-menu-item routerLink="/profile">
                <mat-icon>person</mat-icon>
                Profile
              </button>
              <button mat-menu-item routerLink="/settings">
                <mat-icon>settings</mat-icon>
                Settings
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()" class="logout-item">
                <mat-icon>logout</mat-icon>
                Sign Out
              </button>
            </mat-menu>
          </ng-container>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 70px;
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      text-decoration: none;
      transition: transform 0.3s ease;
    }

    .brand:hover {
      transform: scale(1.05);
    }

    .brand-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #667eea;
    }

    .brand-text {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-links button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .nav-links button:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: translateY(-1px);
    }

    .nav-links button.active {
      background: var(--primary-gradient);
      color: white;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .login-btn {
      color: #667eea;
      font-weight: 500;
    }

    .register-btn {
      background: var(--primary-gradient) !important;
      color: white !important;
      font-weight: 500;
      border-radius: 8px;
      padding: 8px 20px;
    }

    .user-avatar {
      width: 44px;
      height: 44px;
      background: var(--primary-gradient);
      color: white;
      border-radius: 50%;
    }

    .user-info {
      padding: 16px;
      text-align: center;
    }

    .user-name {
      font-weight: 600;
      font-size: 16px;
      color: #1e293b;
    }

    .user-role {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }

    .logout-item {
      color: #ef4444;
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
      
      .nav-container {
        padding: 0 16px;
      }
      
      .brand-text {
        font-size: 20px;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  isLoggedIn = true;
  userRole: 'TENANT' | 'OWNER' | 'ADMIN' = 'TENANT';
  userName = 'John Doe';

  ngOnInit() {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    // Demo: Show different roles
    this.isLoggedIn = true;
    this.userRole = 'TENANT';
    this.userName = 'John Doe';
  }

  logout() {
    this.isLoggedIn = false;
    console.log('User logged out');
  }
}