import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { SidebarComponent, SidebarItem } from '../../shared/shared/sidebar/sidebar.component';
import { SidebarService } from '../../core/services/sidebar.service';
import { BookingService } from '../../core/services/booking.service';
import { BookingStateService } from '../../core/services/booking-state.service';
import { LucideAngularModule, Search, Calendar, Home, BarChart3, Clock, CheckCircle, XCircle } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tenant-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, SidebarComponent, LucideAngularModule],
  template: `
    <app-navbar></app-navbar>
    
    <div class="page-wrapper">
      <div class="dashboard-container">
        <app-sidebar 
          title="Tenant Dashboard" 
          [items]="sidebarItems" 
          [isOpen]="(sidebarService.sidebarOpen$ | async) ?? false"
          [toggleIcon]="BarChart3"
          (toggle)="sidebarService.toggle()">
        </app-sidebar>

        <div class="main-content" [class.sidebar-open]="(sidebarService.sidebarOpen$ | async) ?? false">
          <div class="content-wrapper">
            <div class="header-section">
              <h1 class="page-title">My Bookings</h1>
              <p class="page-subtitle">Track your property booking requests and status</p>
            </div>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{getTotalBookings()}}</div>
                  <div class="stat-label">Total Bookings</div>
                </div>
              </div>
              <div class="stat-card pending">
                <div class="stat-content">
                  <div class="stat-number">{{getPendingBookings()}}</div>
                  <div class="stat-label">Pending</div>
                </div>
              </div>
              <div class="stat-card approved">
                <div class="stat-content">
                  <div class="stat-number">{{getApprovedBookings()}}</div>
                  <div class="stat-label">Approved</div>
                </div>
              </div>
              <div class="stat-card rejected">
                <div class="stat-content">
                  <div class="stat-number">{{getRejectedBookings()}}</div>
                  <div class="stat-label">Rejected</div>
                </div>
              </div>
            </div>

            <div class="bookings-container">
              <div class="empty-state">
                <div class="empty-icon">
                  <lucide-icon [img]="Calendar" class="w-12 h-12 text-gray-400"></lucide-icon>
                </div>
                <h3 class="empty-title">No bookings yet</h3>
                <p class="empty-subtitle">Start by browsing properties and making your first booking request.</p>
                <button class="browse-btn" (click)="navigateToBrowse()">
                  <lucide-icon [img]="Search" class="btn-icon"></lucide-icon>
                  Browse Properties
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    .page-wrapper {
      min-height: calc(100vh - 140px);
    }

    .dashboard-container {
      display: flex;
      min-height: 100%;
      background: #f9fafb;
      padding-top: 70px;
      position: relative;
    }

    .main-content {
      flex: 1;
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

    .content-wrapper {
      padding: 2rem;
    }

    .header-section {
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
    }

    .page-subtitle {
      color: #6b7280;
      font-size: 1rem;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      border-left: 4px solid #e5e7eb;
    }

    .stat-card.pending {
      border-left-color: #f59e0b;
    }

    .stat-card.approved {
      border-left-color: #10b981;
    }

    .stat-card.rejected {
      border-left-color: #ef4444;
    }

    .stat-content {
      text-align: left;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      color: #6b7280;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .bookings-container {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
    }

    .empty-icon {
      margin-bottom: 1rem;
    }

    .empty-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.5rem;
    }

    .empty-subtitle {
      color: #6b7280;
      margin-bottom: 2rem;
    }

    .browse-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background-color: #4f46e5;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .browse-btn:hover {
      background-color: #4338ca;
    }

    .btn-icon {
      width: 16px;
      height: 16px;
    }

    .w-12 { width: 3rem; }
    .h-12 { height: 3rem; }
    .text-gray-400 { color: #9ca3af; }

    @media (max-width: 768px) {
      .content-wrapper {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TenantBookingsComponent implements OnInit, OnDestroy {
  bookings: any[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', route: '/tenant/dashboard', icon: BarChart3 },
    { label: 'Browse Properties', route: '/properties', icon: Search },
    { label: 'My Bookings', route: '/tenant/bookings', icon: Calendar }
  ];

  readonly Search = Search;
  readonly Calendar = Calendar;
  readonly Home = Home;
  readonly BarChart3 = BarChart3;
  readonly Clock = Clock;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;

  constructor(
    private router: Router,
    public sidebarService: SidebarService,
    private bookingService: BookingService,
    private bookingStateService: BookingStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBookings();
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
          this.loadBookings(); // Refresh bookings when status changes
        }
      });
  }

  loadBookings() {
    this.loading = true;
    this.bookingService.getTenantBookings().subscribe({
      next: (response) => {
        this.bookings = response.data?.bookings || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getTotalBookings(): number {
    return this.bookings.length;
  }

  getPendingBookings(): number {
    return this.bookings.filter(b => b.status === 'Pending').length;
  }

  getApprovedBookings(): number {
    return this.bookings.filter(b => b.status === 'Approved').length;
  }

  getRejectedBookings(): number {
    return this.bookings.filter(b => b.status === 'Rejected').length;
  }

  navigateToBrowse() {
    this.router.navigate(['/properties']);
  }
}