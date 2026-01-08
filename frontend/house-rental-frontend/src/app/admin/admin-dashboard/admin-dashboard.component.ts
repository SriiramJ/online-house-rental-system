import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, SystemStats } from '../../core/services/admin.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats: SystemStats | null = null;
  loading = true;
  error = '';

  constructor(
    private adminService: AdminService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadSystemStats();
  }

  loadSystemStats() {
    console.log('Starting to load system stats...');
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();
    
    // Force stop loading after 2 seconds
    setTimeout(() => {
      console.log('Force stopping loading...');
      this.loading = false;
      if (!this.stats) {
        this.stats = {
          users: [
            { role: 'TENANT', count: 0 },
            { role: 'OWNER', count: 0 },
            { role: 'ADMIN', count: 1 }
          ],
          properties: 0,
          bookings: {
            total: 0,
            by_status: [
              { status: 'Pending', count: 0 },
              { status: 'Approved', count: 0 },
              { status: 'Rejected', count: 0 }
            ]
          }
        };
      }
      this.cdr.detectChanges();
    }, 2000);
    
    this.adminService.getSystemStats().subscribe({
      next: (response) => {
        console.log('Stats response received:', response);
        if (response.success) {
          this.stats = response.data;
          console.log('Stats set:', this.stats);
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Stats error:', error);
        this.loading = false;
        this.stats = {
          users: [
            { role: 'TENANT', count: 0 },
            { role: 'OWNER', count: 0 },
            { role: 'ADMIN', count: 1 }
          ],
          properties: 0,
          bookings: {
            total: 0,
            by_status: [
              { status: 'Pending', count: 0 },
              { status: 'Approved', count: 0 },
              { status: 'Rejected', count: 0 }
            ]
          }
        };
        this.cdr.detectChanges();
        this.toast.error('Error', 'Using mock data - API connection failed');
      }
    });
  }

  getUserCount(role: string): number {
    return this.stats?.users.find(u => u.role === role)?.count || 0;
  }

  getBookingCount(status: string): number {
    return this.stats?.bookings.by_status.find(b => b.status === status)?.count || 0;
  }
}