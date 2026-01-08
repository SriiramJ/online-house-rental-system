import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, AdminUser } from '../../core/services/admin.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: AdminUser[] = [];
  loading = true;
  error = '';

  constructor(
    private adminService: AdminService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.cdr.detectChanges();
    
    // Force stop loading after 3 seconds
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
    }, 3000);
    
    this.adminService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.error = 'Failed to load users';
        this.loading = false;
        this.cdr.detectChanges();
        this.toast.error('Error', 'Failed to load users');
      }
    });
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ADMIN': return 'badge-admin';
      case 'OWNER': return 'badge-owner';
      case 'TENANT': return 'badge-tenant';
      default: return 'badge-default';
    }
  }
}