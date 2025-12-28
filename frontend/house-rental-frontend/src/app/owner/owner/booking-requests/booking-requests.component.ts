import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { SidebarComponent, SidebarItem } from '../../../shared/shared/sidebar/sidebar.component';
import { OwnerService } from '../../../core/services/owner.service';
import { ToastService } from '../../../core/services/toast.service';
import { LucideAngularModule, Check, X, Clock, User, ArrowLeft, Menu, BarChart3, Home, Calendar, Users, Mail, Phone, MapPin, MessageSquare } from 'lucide-angular';

@Component({
  selector: 'app-booking-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent, SidebarComponent, LucideAngularModule],
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
              <h1 class="page-title">Booking Requests</h1>
              <p class="page-subtitle">Review and manage tenant booking requests</p>
            </div>

            <!-- Statistics Cards -->
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{getTotalRequests()}}</div>
                  <div class="stat-label">Total Requests</div>
                </div>
              </div>
              <div class="stat-card pending">
                <div class="stat-content">
                  <div class="stat-number">{{getPendingRequests()}}</div>
                  <div class="stat-label">Pending</div>
                </div>
              </div>
              <div class="stat-card approved">
                <div class="stat-content">
                  <div class="stat-number">{{getApprovedRequests()}}</div>
                  <div class="stat-label">Approved</div>
                </div>
              </div>
              <div class="stat-card rejected">
                <div class="stat-content">
                  <div class="stat-number">{{getRejectedRequests()}}</div>
                  <div class="stat-label">Rejected</div>
                </div>
              </div>
            </div>

            <!-- Filter Tabs -->
            <div class="filter-tabs">
              <button 
                *ngFor="let filter of filters" 
                [class.active]="activeFilter === filter.key"
                (click)="setActiveFilter(filter.key)"
                class="filter-tab">
                {{filter.label}} ({{filter.count}})
              </button>
            </div>

            <!-- Booking Requests List -->
            <div class="requests-container">
              <div *ngIf="loading" class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading booking requests...</p>
              </div>
              
              <div *ngIf="!loading && filteredRequests.length === 0" class="empty-state">
                <div class="empty-icon">
                  <lucide-icon [img]="Calendar" class="w-12 h-12 text-gray-400"></lucide-icon>
                </div>
                <h3 class="empty-title">No {{activeFilter}} requests</h3>
                <p class="empty-subtitle">There are no {{activeFilter.toLowerCase()}} booking requests at the moment.</p>
              </div>

              <div *ngFor="let request of filteredRequests" class="request-card">
                <div class="request-header">
                  <div class="tenant-info">
                    <div class="tenant-avatar">
                      <span>{{request.tenantName.charAt(0)}}</span>
                    </div>
                    <div class="tenant-details">
                      <h3 class="tenant-name">{{request.tenantName}}</h3>
                      <div class="contact-info">
                        <lucide-icon [img]="Mail" class="w-4 h-4"></lucide-icon>
                        <span>{{request.tenantEmail}}</span>
                      </div>
                      <div class="contact-info">
                        <lucide-icon [img]="Phone" class="w-4 h-4"></lucide-icon>
                        <span>{{request.tenantPhone}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="request-date">
                    <span class="date-label">{{request.requestDate}}</span>
                    <span [ngClass]="getStatusClass(request.status)" class="status-badge">
                      {{request.status}}
                    </span>
                  </div>
                </div>

                <div class="property-section">
                  <div class="property-image">
                    <img [src]="request.propertyImage" [alt]="request.propertyTitle" />
                  </div>
                  <div class="property-details">
                    <h4 class="property-title">{{request.propertyTitle}}</h4>
                    <div class="property-location">
                      <lucide-icon [img]="MapPin" class="w-4 h-4"></lucide-icon>
                      <span>{{request.propertyLocation}}</span>
                    </div>
                    <div class="property-price">\${{request.rent}}/month</div>
                    <div class="move-in-info">
                      <lucide-icon [img]="Calendar" class="w-4 h-4"></lucide-icon>
                      <span>Move-in: {{request.moveInDate}}</span>
                    </div>
                  </div>
                </div>

                <div class="message-section" *ngIf="request.message">
                  <div class="message-header">
                    <lucide-icon [img]="MessageSquare" class="w-4 h-4"></lucide-icon>
                    <span>Message from tenant:</span>
                  </div>
                  <p class="message-text">{{request.message}}</p>
                </div>

                <div class="action-section" *ngIf="request.status === 'Pending'">
                  <button (click)="openRejectModal(request)" class="reject-btn">
                    <lucide-icon [img]="X" class="w-4 h-4"></lucide-icon>
                    Reject
                  </button>
                  <button (click)="updateBookingStatus(request.id, 'Approved')" class="approve-btn">
                    <lucide-icon [img]="Check" class="w-4 h-4"></lucide-icon>
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-footer></app-footer>

    <!-- Reject Modal -->
    <div *ngIf="showRejectModal" class="modal-overlay" (click)="closeRejectModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h2 class="modal-title">Reject Booking</h2>
        <p class="modal-subtitle">Please provide a reason for rejecting this booking request from {{selectedRequest?.tenant_name}}.</p>
        
        <textarea 
          [(ngModel)]="rejectReason"
          class="reject-textarea"
          rows="4"
          placeholder="e.g., Property already booked, dates not available, etc."
        ></textarea>
        
        <div class="modal-actions">
          <button (click)="closeRejectModal()" class="cancel-btn">Cancel</button>
          <button (click)="confirmReject()" class="reject-btn" [disabled]="!rejectReason.trim()">Reject Booking</button>
        </div>
      </div>
    </div>
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

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .filter-tab {
      padding: 0.75rem 1rem;
      background: none;
      border: none;
      color: #6b7280;
      font-weight: 500;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }

    .filter-tab:hover {
      color: #4f46e5;
    }

    .filter-tab.active {
      color: #4f46e5;
      border-bottom-color: #4f46e5;
    }

    .requests-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
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

    .request-card {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .request-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .tenant-info {
      display: flex;
      gap: 1rem;
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

    .tenant-details {
      flex: 1;
    }

    .tenant-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.5rem;
    }

    .contact-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #6b7280;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .request-date {
      text-align: right;
    }

    .date-label {
      display: block;
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 0.5rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-approved {
      background: #d1fae5;
      color: #065f46;
    }

    .status-rejected {
      background: #fee2e2;
      color: #991b1b;
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
      width: 5rem;
      height: 4rem;
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
      margin-bottom: 0.5rem;
    }

    .property-location {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #6b7280;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .property-price {
      color: #4f46e5;
      font-weight: 600;
      font-size: 1.125rem;
      margin-bottom: 0.5rem;
    }

    .move-in-info {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .message-section {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 0.5rem;
      border-left: 3px solid #4f46e5;
    }

    .message-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #374151;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .message-text {
      color: #4b5563;
      line-height: 1.5;
      margin: 0;
    }

    .action-section {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    .reject-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: white;
      color: #dc2626;
      border: 1px solid #dc2626;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .reject-btn:hover {
      background: #dc2626;
      color: white;
    }

    .approve-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .approve-btn:hover {
      background: #059669;
    }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: white;
      border-radius: 0.75rem;
      padding: 2rem;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    
    .modal-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.5rem 0;
    }
    
    .modal-subtitle {
      color: #6b7280;
      margin: 0 0 1.5rem 0;
      line-height: 1.5;
    }
    
    .reject-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      resize: vertical;
      margin-bottom: 1.5rem;
    }
    
    .reject-textarea:focus {
      outline: none;
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .modal-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }
    
    .cancel-btn {
      padding: 0.75rem 1.5rem;
      border: 1px solid #d1d5db;
      background: #ffffff;
      color: #374151;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
    }
    
    .cancel-btn:hover {
      background: #f9fafb;
    }
    
    .reject-btn {
      padding: 0.75rem 1.5rem;
      background: #dc2626;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
    }
    
    .reject-btn:hover:not(:disabled) {
      background: #b91c1c;
    }
    
    .reject-btn:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .content-wrapper {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .request-header {
        flex-direction: column;
        gap: 1rem;
      }

      .property-section {
        flex-direction: column;
      }

      .property-image {
        width: 100%;
        height: 8rem;
      }

      .action-section {
        flex-direction: column;
      }
    }
  `]
})
export class BookingRequestsComponent implements OnInit {
  readonly Check = Check;
  readonly X = X;
  readonly Clock = Clock;
  readonly User = User;
  readonly ArrowLeft = ArrowLeft;
  readonly Menu = Menu;
  readonly BarChart3 = BarChart3;
  readonly Home = Home;
  readonly Calendar = Calendar;
  readonly Users = Users;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly MapPin = MapPin;
  readonly MessageSquare = MessageSquare;

  bookingRequests: any[] = [];
  filteredRequests: any[] = [];
  loading = false;
  showRejectModal = false;
  selectedRequest: any = null;
  rejectReason = '';
  sidebarOpen = true;
  activeFilter = 'All';
  filters: any[] = [];
  
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
    this.loadBookingRequests();
    this.setSidebarInitialState();
    this.updateFilters();
  }

  setSidebarInitialState() {
    this.sidebarOpen = window.innerWidth >= 1024;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  loadBookingRequests() {
    this.loading = true;
    // Mock data for UI testing - immediate load
    this.bookingRequests = [
      {
        id: 1,
        tenantName: 'Alice Johnson',
        tenantEmail: 'alice@example.com',
        tenantPhone: '+1 (555) 111-2222',
        propertyTitle: 'Modern Downtown Apartment',
        propertyLocation: 'Downtown, NYC',
        propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        rent: 2500,
        moveInDate: '15/01/2025',
        leaseDuration: '12 months',
        message: 'I am very interested in this property. I work as a software engineer and looking for a long-term rental. I have excellent references from my previous landlord.',
        status: 'Pending',
        requestDate: '14/12/2025'
      },
      {
        id: 2,
        tenantName: 'Bob Smith',
        tenantEmail: 'bob@example.com',
        tenantPhone: '+1 (555) 222-3333',
        propertyTitle: 'Cozy Suburban House',
        propertyLocation: 'Suburbia, California',
        propertyImage: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
        rent: 3200,
        moveInDate: '01/02/2025',
        leaseDuration: '18 months',
        message: 'Family of four looking for a safe neighborhood. Both parents are working professionals with stable employment.',
        status: 'Approved',
        requestDate: '10/12/2025'
      },
      {
        id: 3,
        tenantName: 'Carol Martinez',
        tenantEmail: 'carol@example.com',
        tenantPhone: '+1 (555) 333-4444',
        propertyTitle: 'Luxury Villa with Pool',
        propertyLocation: 'Queens, NYC',
        propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
        rent: 4500,
        moveInDate: '20/01/2025',
        leaseDuration: '24 months',
        message: 'Interested in a long-term lease. Can provide first and last month rent upfront plus security deposit.',
        status: 'Rejected',
        requestDate: '08/12/2025'
      },
      {
        id: 4,
        tenantName: 'David Chen',
        tenantEmail: 'david@example.com',
        tenantPhone: '+1 (555) 444-5555',
        propertyTitle: 'Modern Downtown Apartment',
        propertyLocation: 'Downtown, NYC',
        propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        rent: 2500,
        moveInDate: '01/03/2025',
        leaseDuration: '12 months',
        message: 'Looking for a modern apartment close to work. I have a stable job and good credit history.',
        status: 'Pending',
        requestDate: '12/12/2025'
      }
    ];
    this.loading = false;
    this.updateFilters();
    this.filterRequests();
  }

  updateFilters() {
    const totalCount = this.bookingRequests.length;
    const pendingCount = this.bookingRequests.filter(r => r.status === 'Pending').length;
    const approvedCount = this.bookingRequests.filter(r => r.status === 'Approved').length;
    const rejectedCount = this.bookingRequests.filter(r => r.status === 'Rejected').length;

    this.filters = [
      { key: 'All', label: 'All', count: totalCount },
      { key: 'Pending', label: 'Pending', count: pendingCount },
      { key: 'Approved', label: 'Approved', count: approvedCount },
      { key: 'Rejected', label: 'Rejected', count: rejectedCount }
    ];
  }

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
    this.filterRequests();
  }

  filterRequests() {
    if (this.activeFilter === 'All') {
      this.filteredRequests = [...this.bookingRequests];
    } else {
      this.filteredRequests = this.bookingRequests.filter(r => r.status === this.activeFilter);
    }
  }

  getTotalRequests(): number {
    return this.bookingRequests.length;
  }

  getPendingRequests(): number {
    return this.bookingRequests.filter(r => r.status === 'Pending').length;
  }

  getApprovedRequests(): number {
    return this.bookingRequests.filter(r => r.status === 'Approved').length;
  }

  getRejectedRequests(): number {
    return this.bookingRequests.filter(r => r.status === 'Rejected').length;
  }

  updateBookingStatus(bookingId: number, status: string) {
    // Mock API call for UI testing
    setTimeout(() => {
      this.toast.success(`Booking ${status.toLowerCase()} successfully`);
      // Update the status in mock data
      const request = this.bookingRequests.find(r => r.id === bookingId);
      if (request) {
        request.status = status;
      }
    }, 500);
    
    // Real API call (commented out for mock)
    // this.ownerService.updateBookingStatus(bookingId, status).subscribe({
    //   next: (response) => {
    //     this.toast.success(`Booking ${status.toLowerCase()} successfully`);
    //     this.loadBookingRequests();
    //   },
    //   error: (error) => {
    //     this.toast.error(`Failed to ${status.toLowerCase()} booking`);
    //   }
    // });
  }

  oldBookingRequests = [
    {
      id: 1,
      tenantName: 'John Smith',
      tenantEmail: 'john.smith@email.com',
      propertyTitle: 'Modern Downtown Apartment',
      propertyLocation: 'Downtown, NYC',
      rent: 2500,
      moveInDate: 'March 15, 2024',
      leaseDuration: '12 months',
      message: 'I am very interested in this property. I have stable income and excellent references.',
      status: 'Pending'
    },
    {
      id: 2,
      tenantName: 'Sarah Johnson',
      tenantEmail: 'sarah.j@email.com',
      propertyTitle: 'Cozy Studio Loft',
      propertyLocation: 'Brooklyn, NY',
      rent: 1800,
      moveInDate: 'April 1, 2024',
      leaseDuration: '6 months',
      message: 'Looking for a short-term lease. I am a graduate student with good credit score.',
      status: 'Approved'
    },
    {
      id: 3,
      tenantName: 'Mike Davis',
      tenantEmail: 'mike.davis@email.com',
      propertyTitle: 'Luxury Penthouse',
      propertyLocation: 'Manhattan, NY',
      rent: 5000,
      moveInDate: 'March 20, 2024',
      leaseDuration: '24 months',
      message: 'Interested in a long-term lease. Can provide first and last month rent upfront.',
      status: 'Rejected'
    }
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Approved':
        return 'status-approved';
      case 'Rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  }

  goToDashboard() {
    this.router.navigate(['/owner/dashboard']);
  }

  openRejectModal(request: any) {
    this.selectedRequest = request;
    this.rejectReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal() {
    this.showRejectModal = false;
    this.selectedRequest = null;
    this.rejectReason = '';
  }

  confirmReject() {
    if (this.selectedRequest && this.rejectReason.trim()) {
      // Mock API call for UI testing
      setTimeout(() => {
        this.toast.success('Booking rejected successfully');
        // Update the status in mock data
        if (this.selectedRequest) {
          this.selectedRequest.status = 'Rejected';
        }
        this.closeRejectModal();
      }, 500);
      
      // Real API call (commented out for mock)
      // this.ownerService.updateBookingStatus(this.selectedRequest.id, 'Rejected').subscribe({
      //   next: (response) => {
      //     this.toast.success('Booking rejected successfully');
      //     this.closeRejectModal();
      //     this.loadBookingRequests();
      //   },
      //   error: (error) => {
      //     this.toast.error('Failed to reject booking');
      //   }
      // });
    }
  }
}