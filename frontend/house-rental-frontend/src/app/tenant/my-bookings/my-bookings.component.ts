import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="bookings-container">
      <div class="bookings-content">
        <h1>My Bookings</h1>
        <p>View and manage your property booking requests.</p>
      </div>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    .bookings-container {
      min-height: 100vh;
      background: #f9fafb;
      padding-top: 70px;
    }
    
    .bookings-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 1rem;
    }
  `]
})
export class MyBookingsComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    // This component is not being used - tenant-bookings is the main one
    // Redirect to tenant-bookings
    this.router.navigate(['/tenant/bookings']);
  }
}