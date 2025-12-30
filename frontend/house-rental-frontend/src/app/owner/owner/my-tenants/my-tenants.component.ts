import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { SidebarComponent, SidebarItem } from '../../../shared/shared/sidebar/sidebar.component';
import { BookingService } from '../../../core/services/booking.service';
import { SidebarService } from '../../../core/services/sidebar.service';
import { ToastService } from '../../../core/services/toast.service';
import { PropertyStateService } from '../../../core/services/property-state.service';
import { LucideAngularModule, User, Phone, Mail, MapPin, Calendar, ArrowLeft, Menu, BarChart3, Home, Users, DollarSign } from 'lucide-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-tenants',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, SidebarComponent, LucideAngularModule],
  templateUrl: './my-tenants.component.html',
  styleUrls: ['./my-tenants.component.css']
})
export class MyTenantsComponent implements OnInit, OnDestroy {
  readonly User = User;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly MapPin = MapPin;
  readonly Calendar = Calendar;
  readonly ArrowLeft = ArrowLeft;
  readonly Menu = Menu;
  readonly BarChart3 = BarChart3;
  readonly Home = Home;
  readonly Users = Users;
  readonly DollarSign = DollarSign;

  tenants: any[] = [];
  loading = true;
  private subscriptions: Subscription[] = [];
  sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', route: '/owner/dashboard', icon: BarChart3 },
    { label: 'My Properties', route: '/owner/properties', icon: Home },
    { label: 'Booking Requests', route: '/owner/booking-requests', icon: Calendar },
    { label: 'My Tenants', route: '/owner/tenants', icon: Users }
  ];

  constructor(
    private bookingService: BookingService,
    private toast: ToastService,
    public sidebarService: SidebarService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private propertyStateService: PropertyStateService
  ) {}

  ngOnInit() {
    this.loadTenants();
    this.setupPropertyStateListener();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupPropertyStateListener() {
    const dashboardSub = this.propertyStateService.dashboardUpdated$.subscribe(() => {
      this.loadTenants();
    });
    this.subscriptions.push(dashboardSub);
  }

  loadTenants() {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.bookingService.getOwnerTenants().subscribe({
      next: (response) => {
        this.tenants = (response.tenants || []).map((tenant: any) => ({
          id: tenant.tenant_id,
          name: tenant.tenant_name,
          email: tenant.tenant_email,
          phone: tenant.tenant_phone || 'N/A',
          status: 'Active',
          propertyTitle: tenant.property_title,
          propertyLocation: tenant.property_location,
          propertyImage: this.getPropertyImage(tenant),
          rent: Number(tenant.rent),
          leaseStart: this.formatDate(tenant.move_in_date),
          leaseEnd: 'N/A',
          nextPayment: this.getNextPaymentDate(tenant.move_in_date)
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading tenants:', error);
        this.tenants = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getActiveTenants(): number {
    return this.tenants.filter(t => t.status === 'Active').length;
  }

  getOccupiedProperties(): number {
    const uniqueProperties = new Set(this.tenants.filter(t => t.status === 'Active').map(t => t.propertyTitle));
    return uniqueProperties.size;
  }

  getMonthlyRevenue(): number {
    return this.tenants.filter(t => t.status === 'Active').reduce((total, tenant) => total + Number(tenant.rent), 0);
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  }

  getPropertyImage(tenant: any): string {
    if (tenant.property_photos) {
      try {
        const photos = JSON.parse(tenant.property_photos);
        return photos.length > 0 ? photos[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400';
      } catch {
        return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400';
      }
    }
    return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400';
  }

  getNextPaymentDate(moveInDate: string): string {
    const moveIn = new Date(moveInDate);
    const nextPayment = new Date(moveIn);
    nextPayment.setMonth(nextPayment.getMonth() + 1);
    return this.formatDate(nextPayment.toISOString());
  }

  isPaymentOverdue(nextPayment: string): boolean {
    const paymentDate = new Date(nextPayment);
    const today = new Date();
    return paymentDate < today;
  }

  goToDashboard() {
    this.router.navigate(['/owner/dashboard']);
  }
}