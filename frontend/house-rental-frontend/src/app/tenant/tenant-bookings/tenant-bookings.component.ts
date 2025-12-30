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
  templateUrl: './tenant-bookings.component.html',
  styleUrls: ['./tenant-bookings.component.scss']
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
          this.loadBookings();
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
    return this.bookings.filter(b => b.status?.toLowerCase() === 'pending').length;
  }

  getApprovedBookings(): number {
    return this.bookings.filter(b => b.status?.toLowerCase() === 'approved').length;
  }

  getRejectedBookings(): number {
    return this.bookings.filter(b => b.status?.toLowerCase() === 'rejected').length;
  }

  navigateToBrowse() {
    this.router.navigate(['/properties']);
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  getStatusIcon(status: string) {
    switch (status?.toLowerCase()) {
      case 'pending':
        return this.Clock;
      case 'approved':
        return this.CheckCircle;
      case 'rejected':
        return this.XCircle;
      default:
        return this.Clock;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}