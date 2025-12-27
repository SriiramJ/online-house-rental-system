import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { SidebarComponent, SidebarItem } from '../../shared/shared/sidebar/sidebar.component';
import { OwnerService } from '../../core/services/owner.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { LucideAngularModule, Plus, Home, Users, Calendar, DollarSign, TrendingUp, Eye, Menu, BarChart3 } from 'lucide-angular';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, SidebarComponent, LucideAngularModule],
  template: `
    <app-navbar></app-navbar>
    
    <div class="dashboard-container">
      <!-- Sidebar Toggle Button -->
      <app-sidebar 
        title="Owner Dashboard" 
        [items]="sidebarItems" 
        [isOpen]="sidebarOpen"
        [toggleIcon]="Menu"
        (toggle)="toggleSidebar()">
      </app-sidebar>

      <!-- Main Content -->
      <div class="main-content" [class.sidebar-open]="sidebarOpen">
        <div class="content-header">
          <div class="greeting-section">
            <h1>{{getGreeting()}}</h1>
            <p>Welcome back to your dashboard</p>
          </div>
          <button class="add-property-btn" (click)="navigateToAddProperty()">
            <lucide-icon [img]="Plus" class="btn-icon"></lucide-icon>
            Add Property
          </button>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon stat-primary">
              <lucide-icon [img]="Home"></lucide-icon>
            </div>
            <div class="stat-content">
              <h3>{{dashboardData?.stats?.totalProperties || 0}}</h3>
              <p>Total Properties</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon stat-warning">
              <lucide-icon [img]="Calendar"></lucide-icon>
            </div>
            <div class="stat-content">
              <h3>{{dashboardData?.stats?.pendingRequests || 0}}</h3>
              <p>Pending Requests</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon stat-success">
              <lucide-icon [img]="Users"></lucide-icon>
            </div>
            <div class="stat-content">
              <h3>{{dashboardData?.stats?.activeTenants || 0}}</h3>
              <p>Active Tenants</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon stat-info">
              <lucide-icon [img]="DollarSign"></lucide-icon>
            </div>
            <div class="stat-content">
              <h3>\${{dashboardData?.stats?.monthlyRevenue || 0}}</h3>
              <p>Monthly Revenue</p>
            </div>
          </div>
        </div>

        <!-- Recent Sections -->
        <div class="dashboard-sections">
          <!-- Recent Booking Requests -->
          <div class="section-card">
            <div class="section-header">
              <h2>Recent Booking Requests</h2>
              <button class="view-all-btn" (click)="navigateToBookings()">
                <lucide-icon [img]="Eye" class="btn-icon"></lucide-icon>
                View All
              </button>
            </div>
            <div class="section-content">
              <div *ngIf="dashboardData?.recentBookings?.length === 0" class="empty-state">
                No recent booking requests
              </div>
              <div *ngFor="let booking of dashboardData?.recentBookings" class="booking-item">
                <div class="booking-info">
                  <h4>{{booking.property_title}}</h4>
                  <p>{{booking.tenant_name}} - {{booking.tenant_email}}</p>
                  <span class="booking-date">{{formatDate(booking.request_time)}}</span>
                </div>
                <div class="booking-status status-{{booking.status.toLowerCase()}}">
                  {{booking.status}}
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Tenants -->
          <div class="section-card">
            <div class="section-header">
              <h2>Recent Tenants</h2>
              <button class="view-all-btn" (click)="navigateToTenants()">
                <lucide-icon [img]="Eye" class="btn-icon"></lucide-icon>
                View All
              </button>
            </div>
            <div class="section-content">
              <div *ngIf="dashboardData?.recentTenants?.length === 0" class="empty-state">
                No tenants yet
              </div>
              <div *ngFor="let tenant of dashboardData?.recentTenants" class="tenant-item">
                <div class="tenant-info">
                  <h4>{{tenant.name}}</h4>
                  <p>{{tenant.email}}</p>
                  <span class="tenant-property">{{tenant.property_title}}</span>
                </div>
                <div class="tenant-date">
                  {{formatDate(tenant.move_in_date)}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Section -->
    <div class="quick-actions-section">
      <div class="quick-actions-card">
        <h2>Quick Actions</h2>
        <div class="quick-actions-grid">
          <button class="quick-action-btn" (click)="navigateToAddProperty()">
            <lucide-icon [img]="Plus" class="action-icon"></lucide-icon>
            <div class="action-content">
              <span class="action-title">Add New Property</span>
              <span class="action-description">List a new property for rent</span>
            </div>
          </button>
          <button class="quick-action-btn" (click)="navigateToBookings()">
            <lucide-icon [img]="Calendar" class="action-icon"></lucide-icon>
            <div class="action-content">
              <span class="action-title">Review Requests</span>
              <span class="action-description">Approve or reject bookings</span>
            </div>
          </button>
          <button class="quick-action-btn" (click)="navigateToTenants()">
            <lucide-icon [img]="Users" class="action-icon"></lucide-icon>
            <div class="action-content">
              <span class="action-title">Manage Tenants</span>
              <span class="action-description">View and contact tenants</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      min-height: calc(100vh - 140px);
      background: #f9fafb;
      padding-top: 70px;
      position: relative;
    }



    .main-content {
      flex: 1;
      padding: 2rem;
      margin-left: 0;
      transition: margin-left 0.3s ease;
    }

    .main-content.sidebar-open {
      margin-left: 280px;
    }

    @media (max-width: 767px) {
      .main-content.sidebar-open {
        margin-left: 0;
      }
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2rem;
    }

    .greeting-section h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }

    .greeting-section p {
      color: #6b7280;
      margin: 0.25rem 0 0 0;
    }

    .add-property-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 700;
      transition: all 0.15s ease-in-out;
      outline: none;
      cursor: pointer;
      border: none;
      height: 2.25rem;
      padding: 0.5rem 1rem;
      background-color: #4f46e5;
      color: white;
    }

    .add-property-btn:hover {
      background-color: #4338ca;
    }

    .btn-icon {
      width: 20px;
      height: 17px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-primary { background: #ddd6fe; color: #4f46e5; }
    .stat-warning { background: #fef3c7; color: #d97706; }
    .stat-success { background: #d1fae5; color: #059669; }
    .stat-info { background: #dbeafe; color: #2563eb; }

    .stat-content h3 {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }

    .stat-content p {
      color: #6b7280;
      margin: 0;
    }

    .dashboard-sections {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .section-card {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .section-header h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .view-all-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #f3f4f6;
      color: #374151;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .view-all-btn:hover {
      background: #e5e7eb;
    }

    .section-content {
      padding: 1rem;
    }

    .empty-state {
      text-align: center;
      color: #6b7280;
      padding: 2rem;
    }

    .booking-item, .tenant-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .booking-item:last-child, .tenant-item:last-child {
      border-bottom: none;
    }

    .booking-info h4, .tenant-info h4 {
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.25rem 0;
    }

    .booking-info p, .tenant-info p {
      color: #6b7280;
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
    }

    .booking-date, .tenant-property {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .booking-status {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-pending { background: #fef3c7; color: #d97706; }
    .status-approved { background: #d1fae5; color: #059669; }
    .status-rejected { background: #fee2e2; color: #dc2626; }

    .tenant-date {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .quick-actions-section {
      margin: 2rem;
    }

    .quick-actions-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }

    .quick-actions-card h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: white;
      margin: 0 0 1.5rem 0;
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .quick-action-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      border: none;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: left;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .quick-action-btn:hover {
      background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .action-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .action-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .action-title {
      font-weight: 600;
      font-size: 1rem;
    }

    .action-description {
      font-size: 0.875rem;
      opacity: 0.9;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        flex-direction: column;
      }
      
      .sidebar {
        width: 100%;
      }
      
      .dashboard-sections {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OwnerDashboardComponent implements OnInit {
  dashboardData: any = null;
  loading = false;
  sidebarOpen = true;
  sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', route: '/owner/dashboard', icon: BarChart3 },
    { label: 'My Properties', route: '/owner/properties', icon: Home },
    { label: 'Booking Requests', route: '/owner/booking-requests', icon: Calendar },
    { label: 'My Tenants', route: '/owner/tenants', icon: Users }
  ];

  readonly Plus = Plus;
  readonly Home = Home;
  readonly Users = Users;
  readonly Calendar = Calendar;
  readonly DollarSign = DollarSign;
  readonly TrendingUp = TrendingUp;
  readonly Eye = Eye;
  readonly Menu = Menu;
  readonly BarChart3 = BarChart3;

  constructor(
    private ownerService: OwnerService,
    private router: Router,
    private toast: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.setSidebarInitialState();
  }

  setSidebarInitialState() {
    this.sidebarOpen = window.innerWidth >= 1024;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  loadDashboardData() {
    this.loading = true;
    this.ownerService.getDashboardData().subscribe({
      next: (response) => {
        this.dashboardData = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.toast.error('Failed to load dashboard', 'Please try again later');
        this.loading = false;
      }
    });
  }

  navigateToAddProperty() {
    this.router.navigate(['/owner/add-property']);
  }

  navigateToBookings() {
    this.router.navigate(['/owner/booking-requests']);
  }

  navigateToTenants() {
    this.router.navigate(['/owner/tenants']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    const userName = this.authService.getCurrentUser()?.name || 'User';
    
    if (hour < 12) {
      return `Good Morning, ${userName}!`;
    } else if (hour < 17) {
      return `Good Afternoon, ${userName}!`;
    } else {
      return `Good Evening, ${userName}!`;
    }
  }
}