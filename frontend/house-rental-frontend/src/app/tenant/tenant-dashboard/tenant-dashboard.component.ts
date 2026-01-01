import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { SidebarComponent, SidebarItem } from '../../shared/shared/sidebar/sidebar.component';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { BookingStateService } from '../../core/services/booking-state.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { LucideAngularModule, Search, Calendar, Home, BarChart3, Eye, X } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, SidebarComponent, LucideAngularModule],
  template: `
    <app-navbar></app-navbar>
    
    <div class="dashboard-container">
      <app-sidebar 
        title="Tenant Dashboard" 
        [items]="sidebarItems" 
        [isOpen]="(sidebarService.sidebarOpen$ | async) ?? false"
        [toggleIcon]="BarChart3"
        (toggle)="sidebarService.toggle()">
      </app-sidebar>

      <div class="main-content" [class.sidebar-open]="(sidebarService.sidebarOpen$ | async) ?? false">
        <div class="content-header">
          <div class="greeting-section">
            <h1>{{getGreeting()}}</h1>
            <p>Welcome to your tenant dashboard</p>
          </div>
          <button class="browse-btn" (click)="navigateToBrowse()">
            <lucide-icon [img]="Search" class="btn-icon"></lucide-icon>
            Browse Properties
          </button>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon stat-primary">
              <lucide-icon [img]="BarChart3"></lucide-icon>
            </div>
            <div class="stat-content">
              <h3>{{dashboardData.totalBookings || 0}}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon stat-warning">
              <lucide-icon [img]="Calendar"></lucide-icon>
            </div>
            <div class="stat-content">
              <h3>{{dashboardData.pendingBookings || 0}}</h3>
              <p>Pending</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon stat-success">
              <lucide-icon [img]="Home"></lucide-icon>
            </div>
            <div class="stat-content">
              <h3>{{dashboardData.approvedBookings || 0}}</h3>
              <p>Approved</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon stat-danger">
              <lucide-icon [img]="X"></lucide-icon>
            </div>
            <div class="stat-content">
              <h3>{{dashboardData.rejectedBookings || 0}}</h3>
              <p>Rejected</p>
            </div>
          </div>
        </div>

        <div class="dashboard-sections">
          <div class="section-card">
            <div class="section-header">
              <h2>Recent Bookings</h2>
              <button class="view-all-btn" (click)="navigateToBookings()">
                <lucide-icon [img]="Eye" class="btn-icon"></lucide-icon>
                View All
              </button>
            </div>
            <div class="section-content">
              <div class="empty-state">
                No recent bookings
              </div>
            </div>
          </div>

          <div class="section-card">
            <div class="section-header">
              <h2>Recommended Properties</h2>
              <button class="view-all-btn" (click)="navigateToBrowse()">
                <lucide-icon [img]="Eye" class="btn-icon"></lucide-icon>
                Browse All
              </button>
            </div>
            <div class="section-content">
              <div class="empty-state">
                Browse properties to see recommendations
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Section -->
        <div class="quick-actions-section">
          <div class="quick-actions-card">
            <h2>Quick Actions</h2>
            <div class="quick-actions-grid">
              <button class="quick-action-btn primary" (click)="navigateToBrowse()">
                <lucide-icon [img]="Search" class="action-icon"></lucide-icon>
                <div class="action-content">
                  <span class="action-title">Browse Properties</span>
                  <span class="action-description">Find your perfect rental home</span>
                </div>
              </button>
              <button class="quick-action-btn secondary" (click)="navigateToBookings()">
                <lucide-icon [img]="Calendar" class="action-icon"></lucide-icon>
                <div class="action-content">
                  <span class="action-title">View My Bookings</span>
                  <span class="action-description">Track your booking requests</span>
                </div>
              </button>
            </div>
            
            <div class="help-section">
              <h3>Need Help?</h3>
              <p>Contact our support team for assistance with your bookings.</p>
              <button class="help-btn" (click)="getSupport()">
                Get Support →
              </button>
            </div>
          </div>
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

    .browse-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: #4f46e5;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
    }

    .browse-btn:hover {
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
    .stat-danger { background: #fee2e2; color: #dc2626; }

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

    @media (max-width: 768px) {
      .dashboard-sections {
        grid-template-columns: 1fr;
      }
    }

    .quick-actions-section {
      margin: 2rem 0;
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
      margin-bottom: 2rem;
    }

    .quick-action-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border: none;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: left;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .quick-action-btn.primary {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
    }

    .quick-action-btn.primary:hover {
      background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .quick-action-btn.secondary {
      background: white;
      color: #374151;
    }

    .quick-action-btn.secondary:hover {
      background: #f9fafb;
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

    .help-section {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0.75rem;
      padding: 1.5rem;
      text-align: center;
    }

    .help-section h3 {
      color: white;
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
    }

    .help-section p {
      color: rgba(255, 255, 255, 0.9);
      margin: 0 0 1rem 0;
      font-size: 0.875rem;
    }

    .help-btn {
      background: white;
      color: #4f46e5;
      border: none;
      border-radius: 0.5rem;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .help-btn:hover {
      background: #f8fafc;
      transform: translateY(-1px);
    }
  `]
})
export class TenantDashboardComponent implements OnInit, OnDestroy {
  dashboardData: any = {
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    rejectedBookings: 0
  };
  loading = false;
  private destroy$ = new Subject<void>();

  sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: BarChart3 },
    { label: 'Browse Properties', route: '/properties', icon: Search },
    { label: 'My Bookings', route: '/tenant/bookings', icon: Calendar }
  ];

  readonly Search = Search;
  readonly Calendar = Calendar;
  readonly Home = Home;
  readonly BarChart3 = BarChart3;
  readonly Eye = Eye;
  readonly X = X;

  constructor(
    private router: Router,
    private authService: AuthService,
    private bookingService: BookingService,
    private bookingStateService: BookingStateService,
    public sidebarService: SidebarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.subscribeToBookingUpdates();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  subscribeToBookingUpdates() {
    this.bookingStateService.bookingUpdates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(update => {
        if (update) {
          this.loadDashboardData();
        }
      });
  }

  loadDashboardData() {
    this.loading = true;
    this.bookingService.getTenantBookings().subscribe({
      next: (response) => {
        const bookings = response.data?.bookings || [];
        this.dashboardData = {
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b: any) => b.status === 'Pending').length,
          approvedBookings: bookings.filter((b: any) => b.status === 'Approved').length,
          rejectedBookings: bookings.filter((b: any) => b.status === 'Rejected').length
        };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  navigateToBrowse() {
    this.router.navigate(['/properties']);
  }

  navigateToBookings() {
    this.router.navigate(['/tenant/bookings']);
  }

  getSupport() {
    this.router.navigate(['/help-center']);
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