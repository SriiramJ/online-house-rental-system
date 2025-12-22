import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
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