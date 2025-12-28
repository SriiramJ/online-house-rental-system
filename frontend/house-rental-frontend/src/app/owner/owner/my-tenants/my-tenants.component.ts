import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { SidebarComponent, SidebarItem } from '../../../shared/shared/sidebar/sidebar.component';
import { OwnerService } from '../../../core/services/owner.service';
import { ToastService } from '../../../core/services/toast.service';
import { LucideAngularModule, User, Phone, Mail, MapPin, Calendar, ArrowLeft, Menu, BarChart3, Home, Users, DollarSign } from 'lucide-angular';

@Component({
  selector: 'app-my-tenants',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, SidebarComponent, LucideAngularModule],
  template: `
    <app-navbar></app-navbar>
    
    <div class="page-wrapper">
      <div class="dashboard-container">
        <!-- Sidebar -->
        <app-sidebar 
          title="Owner Dashboard" 
          [items]="sidebarItems" 
          [isOpen]="sidebarOpen"
          [toggleIcon]="Menu"
          (toggle)="toggleSidebar()">
        </app-sidebar>

        <!-- Main Content -->
        <div class="main-content" [class.sidebar-open]="sidebarOpen">
          <div class="content-wrapper">
            <div class="header-section">
              <h1 class="page-title">My Tenants</h1>
              <p class="page-subtitle">View and manage your active tenants</p>
            </div>

            <!-- Statistics Cards -->
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">
                  <lucide-icon [img]="Users" class="w-6 h-6"></lucide-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{getActiveTenants()}}</div>
                  <div class="stat-label">Active Tenants</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon occupied">
                  <lucide-icon [img]="Home" class="w-6 h-6"></lucide-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{getOccupiedProperties()}}</div>
                  <div class="stat-label">Occupied Properties</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon revenue">
                  <lucide-icon [img]="DollarSign" class="w-6 h-6"></lucide-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-number">\${{getMonthlyRevenue().toLocaleString()}}</div>
                  <div class="stat-label">Monthly Revenue</div>
                </div>
              </div>
            </div>

            <!-- Tenants Grid -->
            <div class="tenants-container">
              <div *ngIf="loading" class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading tenants...</p>
              </div>
              
              <div *ngIf="!loading && tenants.length === 0" class="empty-state">
                <div class="empty-icon">
                  <lucide-icon [img]="Users" class="w-12 h-12 text-gray-400"></lucide-icon>
                </div>
                <h3 class="empty-title">No tenants yet</h3>
                <p class="empty-subtitle">You don't have any active tenants at the moment.</p>
              </div>

              <div class="tenants-grid">
                <div *ngFor="let tenant of tenants" class="tenant-card">
                  <div class="tenant-header">
                    <div class="tenant-avatar">
                      <span>{{tenant.name.charAt(0)}}</span>
                    </div>
                    <div class="tenant-info">
                      <h3 class="tenant-name">{{tenant.name}}</h3>
                      <span [ngClass]="getStatusClass(tenant.status)" class="status-badge">
                        {{tenant.status}}
                      </span>
                    </div>
                  </div>

                  <div class="contact-section">
                    <div class="contact-item">
                      <lucide-icon [img]="Mail" class="w-4 h-4"></lucide-icon>
                      <span>{{tenant.email}}</span>
                    </div>
                    <div class="contact-item">
                      <lucide-icon [img]="Phone" class="w-4 h-4"></lucide-icon>
                      <span>{{tenant.phone}}</span>
                    </div>
                  </div>

                  <div class="property-section">
                    <div class="property-image">
                      <img [src]="tenant.propertyImage" [alt]="tenant.propertyTitle" />
                    </div>
                    <div class="property-details">
                      <h4 class="property-title">{{tenant.propertyTitle}}</h4>
                      <div class="property-location">
                        <lucide-icon [img]="MapPin" class="w-4 h-4"></lucide-icon>
                        <span>{{tenant.propertyLocation}}</span>
                      </div>
                      <div class="property-price">\${{tenant.rent}}/month</div>
                    </div>
                  </div>

                  <div class="lease-section">
                    <div class="lease-item">
                      <lucide-icon [img]="Calendar" class="w-4 h-4"></lucide-icon>
                      <div class="lease-details">
                        <span class="lease-label">Move-in</span>
                        <span class="lease-value">{{tenant.leaseStart}}</span>
                      </div>
                    </div>
                    <div class="lease-item">
                      <lucide-icon [img]="Calendar" class="w-4 h-4"></lucide-icon>
                      <div class="lease-details">
                        <span class="lease-label">Lease End</span>
                        <span class="lease-value">{{tenant.leaseEnd}}</span>
                      </div>
                    </div>
                  </div>

                  <div class="payment-section">
                    <div class="payment-info">
                      <span class="payment-label">Next Payment</span>
                      <span class="payment-date" [ngClass]="isPaymentOverdue(tenant.nextPayment) ? 'overdue' : ''">
                        {{tenant.nextPayment}}
                      </span>
                    </div>
                  </div>

                  <div class="action-section">
                    <button class="action-btn secondary">
                      <lucide-icon [img]="Mail" class="w-4 h-4"></lucide-icon>
                      Send Email
                    </button>
                    <button class="action-btn primary">
                      <lucide-icon [img]="Phone" class="w-4 h-4"></lucide-icon>
                      Call
                    </button>
                  </div>
                </div>
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
      max-width: 80rem;
      margin: 0 auto;
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
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e0e7ff;
      color: #4f46e5;
    }

    .stat-icon.occupied {
      background: #d1fae5;
      color: #059669;
    }

    .stat-icon.revenue {
      background: #dbeafe;
      color: #2563eb;
    }

    .stat-content {
      flex: 1;
    }

    .stat-number {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      color: #6b7280;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .tenants-container {
      margin-top: 2rem;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      color: #6b7280;
    }

    .loading-spinner {
      width: 2rem;
      height: 2rem;
      border: 2px solid #e5e7eb;
      border-top: 2px solid #4f46e5;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
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
    }

    .tenants-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .tenant-card {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .tenant-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .tenant-avatar {
      width: 3rem;
      height: 3rem;
      background: #4f46e5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 1.125rem;
    }

    .tenant-info {
      flex: 1;
    }

    .tenant-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.5rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-active {
      background: #d1fae5;
      color: #065f46;
    }

    .status-inactive {
      background: #fee2e2;
      color: #991b1b;
    }

    .contact-section {
      margin-bottom: 1.5rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #6b7280;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .property-section {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 0.5rem;
    }

    .property-image {
      width: 4rem;
      height: 3rem;
      border-radius: 0.5rem;
      overflow: hidden;
      flex-shrink: 0;
    }

    .property-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .property-details {
      flex: 1;
    }

    .property-title {
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.25rem;
      font-size: 0.875rem;
    }

    .property-location {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #6b7280;
      font-size: 0.75rem;
      margin-bottom: 0.25rem;
    }

    .property-price {
      color: #4f46e5;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .lease-section {
      margin-bottom: 1.5rem;
    }

    .lease-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .lease-details {
      display: flex;
      flex-direction: column;
    }

    .lease-label {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 500;
    }

    .lease-value {
      font-size: 0.875rem;
      color: #111827;
      font-weight: 500;
    }

    .payment-section {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 0.5rem;
      border-left: 3px solid #4f46e5;
    }

    .payment-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .payment-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .payment-date {
      font-size: 0.875rem;
      color: #111827;
      font-weight: 600;
    }

    .payment-date.overdue {
      color: #dc2626;
    }

    .action-section {
      display: flex;
      gap: 0.75rem;
    }

    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border-radius: 0.5rem;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn.secondary {
      background: white;
      color: #4f46e5;
      border: 1px solid #4f46e5;
    }

    .action-btn.secondary:hover {
      background: #4f46e5;
      color: white;
    }

    .action-btn.primary {
      background: #4f46e5;
      color: white;
      border: none;
    }

    .action-btn.primary:hover {
      background: #3730a3;
    }

    @media (max-width: 768px) {
      .content-wrapper {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .tenants-grid {
        grid-template-columns: 1fr;
      }

      .property-section {
        flex-direction: column;
      }

      .property-image {
        width: 100%;
        height: 6rem;
      }

      .action-section {
        flex-direction: column;
      }
    }
  `]
})
export class MyTenantsComponent implements OnInit {
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
  loading = false;
  sidebarOpen = true;
  sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', route: '/owner/dashboard', icon: BarChart3 },
    { label: 'My Properties', route: '/owner/properties', icon: Home },
    { label: 'Booking Requests', route: '/owner/booking-requests', icon: Calendar },
    { label: 'My Tenants', route: '/owner/tenants', icon: Users }
  ];

  constructor(
    private ownerService: OwnerService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTenants();
    this.setSidebarInitialState();
  }

  setSidebarInitialState() {
    this.sidebarOpen = window.innerWidth >= 1024;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  loadTenants() {
    this.loading = true;
    // Mock data for UI testing - immediate load
    this.tenants = [
      {
        id: 1,
        name: 'Carol Martinez',
        email: 'carol@example.com',
        phone: '+1 (555) 333-4444',
        propertyTitle: 'Modern Downtown Apartment',
        propertyLocation: 'Downtown, NYC',
        propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        rent: 2500,
        leaseStart: '20/01/2025',
        leaseEnd: '20/01/2026',
        nextPayment: '20/01/2025',
        status: 'Active'
      },
      {
        id: 2,
        name: 'David Chen',
        email: 'david@example.com',
        phone: '+1 (555) 444-5555',
        propertyTitle: 'Luxury Villa with Pool',
        propertyLocation: 'Queens, NYC',
        propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
        rent: 4500,
        leaseStart: '01/01/2025',
        leaseEnd: '01/01/2026',
        nextPayment: '01/01/2025',
        status: 'Active'
      },
      {
        id: 3,
        name: 'Emma Davis',
        email: 'emma@example.com',
        phone: '+1 (555) 555-6666',
        propertyTitle: 'Cozy Suburban House',
        propertyLocation: 'Suburbia, California',
        propertyImage: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
        rent: 3200,
        leaseStart: '15/12/2024',
        leaseEnd: '15/12/2025',
        nextPayment: '15/01/2025',
        status: 'Active'
      },
      {
        id: 4,
        name: 'Frank Wilson',
        email: 'frank@example.com',
        phone: '+1 (555) 666-7777',
        propertyTitle: 'Modern Downtown Apartment',
        propertyLocation: 'Downtown, NYC',
        propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        rent: 2500,
        leaseStart: '01/11/2024',
        leaseEnd: '01/11/2025',
        nextPayment: '01/01/2025',
        status: 'Active'
      }
    ];
    this.loading = false;
  }

  getActiveTenants(): number {
    return this.tenants.filter(t => t.status === 'Active').length;
  }

  getOccupiedProperties(): number {
    const uniqueProperties = new Set(this.tenants.filter(t => t.status === 'Active').map(t => t.propertyTitle));
    return uniqueProperties.size;
  }

  getMonthlyRevenue(): number {
    return this.tenants.filter(t => t.status === 'Active').reduce((total, tenant) => total + tenant.rent, 0);
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  }

  oldTenants = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      propertyTitle: 'Cozy Studio Loft',
      rent: 1800,
      leaseStart: 'Jan 1, 2024',
      leaseEnd: 'Dec 31, 2024',
      nextPayment: 'Mar 1, 2024',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 987-6543',
      propertyTitle: 'Modern Downtown Apartment',
      rent: 2500,
      leaseStart: 'Feb 15, 2024',
      leaseEnd: 'Feb 14, 2025',
      nextPayment: 'Mar 15, 2024',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      phone: '+1 (555) 456-7890',
      propertyTitle: 'Suburban Family Home',
      rent: 3200,
      leaseStart: 'Dec 1, 2023',
      leaseEnd: 'Nov 30, 2024',
      nextPayment: 'Feb 28, 2024',
      status: 'Overdue'
    }
  ];

  isPaymentOverdue(nextPayment: string): boolean {
    const paymentDate = new Date(nextPayment);
    const today = new Date();
    return paymentDate < today;
  }

  goToDashboard() {
    this.router.navigate(['/owner/dashboard']);
  }
}