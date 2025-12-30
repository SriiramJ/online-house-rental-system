import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(private router: Router, public authService: AuthService) {}

  navigateToProperties() {
    this.router.navigate(['/properties']);
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/auth/register']);
  }

  navigateToDashboard() {
    if (this.authService.isOwner()) {
      this.router.navigate(['/owner/dashboard']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  navigateToTenantBookings() {
    this.router.navigate(['/tenant/bookings']);
  }

  navigateToAddProperty() {
    this.router.navigate(['/owner/add-property']);
  }

  navigateToOwnerProperties() {
    this.router.navigate(['/owner/properties']);
  }

  navigateToHelpCenter() {
    this.router.navigate(['/help-center']);
  }

  navigateToContact() {
    this.router.navigate(['/contact']);
  }
}