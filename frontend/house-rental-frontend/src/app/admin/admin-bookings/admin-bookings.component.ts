import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, AdminBooking } from '../../core/services/admin.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-bookings.component.html',
  styleUrls: ['./admin-bookings.component.scss']
})
export class AdminBookingsComponent implements OnInit {
  bookings: AdminBooking[] = [];
  loading = true;
  error = '';

  constructor(
    private adminService: AdminService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.cdr.detectChanges();
    
    // Force stop loading after 3 seconds
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
    }, 3000);
    
    this.adminService.getAllBookings().subscribe({
      next: (response) => {
        if (response.success) {
          this.bookings = response.data;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.error = 'Failed to load bookings';
        this.loading = false;
        this.cdr.detectChanges();
        this.toast.error('Error', 'Failed to load bookings');
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Approved': return 'badge-approved';
      case 'Pending': return 'badge-pending';
      case 'Rejected': return 'badge-rejected';
      default: return 'badge-default';
    }
  }
}