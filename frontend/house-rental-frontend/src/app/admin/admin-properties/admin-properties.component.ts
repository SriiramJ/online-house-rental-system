import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, AdminProperty } from '../../core/services/admin.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-properties',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-properties.component.html',
  styleUrls: ['./admin-properties.component.scss']
})
export class AdminPropertiesComponent implements OnInit {
  properties: AdminProperty[] = [];
  loading = true;
  error = '';

  constructor(
    private adminService: AdminService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    this.loading = true;
    this.cdr.detectChanges();
    
    // Force stop loading after 3 seconds
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
    }, 3000);
    
    this.adminService.getAllProperties().subscribe({
      next: (response) => {
        if (response.success) {
          this.properties = response.data;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.error = 'Failed to load properties';
        this.loading = false;
        this.cdr.detectChanges();
        this.toast.error('Error', 'Failed to load properties');
      }
    });
  }

  getStatusBadgeClass(property: AdminProperty): string {
    if (property.approved_bookings > 0) return 'badge-rented';
    if (property.pending_requests > 0) return 'badge-pending';
    return 'badge-available';
  }

  getStatusText(property: AdminProperty): string {
    if (property.approved_bookings > 0) return 'Rented';
    if (property.pending_requests > 0) return 'Pending';
    return 'Available';
  }
}