import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="layout-container">
      <app-navbar></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .layout-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .main-content {
      flex: 1;
    }
  `]
})
export class LayoutComponent {
  mobileMenuOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}


  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.mobileMenuOpen = false;
  }

  navigateToHome() {
    this.router.navigate(['/']);
    this.mobileMenuOpen = false;
  }

  navigateToProperties() {
    this.router.navigate(['/properties']);
    this.mobileMenuOpen = false;
  }

  navigateToDashboard() {
    if (this.currentUser?.role === 'OWNER') {
      this.router.navigate(['/owner/dashboard']);
    } else {
      this.router.navigate(['/properties']);
    }
    this.mobileMenuOpen = false;
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
    this.mobileMenuOpen = false;
  }

  navigateToRegister() {
    this.router.navigate(['/auth/register']);
    this.mobileMenuOpen = false;
  }
}