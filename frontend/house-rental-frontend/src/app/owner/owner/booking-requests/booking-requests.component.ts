import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { OwnerService } from '../../../core/services/owner.service';
import { ToastService } from '../../../core/services/toast.service';
import { LucideAngularModule, Check, X, Clock, User, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-booking-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent, LucideAngularModule],
  template: `
    <app-navbar></app-navbar>
    
    <div class="min-h-screen bg-gray-50 pt-20 pb-8">
      <div class="max-w-6xl mx-auto px-4">
        <button 
          (click)="goToDashboard()" 
          style="background: none; border: none; outline: none; padding: 0; margin: 0; font: inherit; color: inherit; text-decoration: none; cursor: pointer;"
          class="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <lucide-icon [img]="ArrowLeft" class="w-4 h-4"></lucide-icon>
          Back to Dashboard
        </button>
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Booking Requests</h1>

        <div class="space-y-4">
          <div *ngIf="loading" class="text-center py-8">
            Loading booking requests...
          </div>
          <div *ngFor="let request of bookingRequests" class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <lucide-icon [img]="User" class="w-5 h-5 text-indigo-600"></lucide-icon>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">{{request.tenantName}}</h3>
                    <p class="text-sm text-gray-500">{{request.tenantEmail}}</p>
                  </div>
                </div>
                
                <div class="mb-4">
                  <h4 class="font-medium text-gray-900 mb-1">{{request.propertyTitle}}</h4>
                  <p class="text-gray-600 text-sm">{{request.propertyLocation}}</p>
                  <p class="text-indigo-600 font-semibold">\${{request.rent}}/month</p>
                </div>

                <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span class="font-medium">Move-in Date:</span> {{request.moveInDate}}
                  </div>
                  <div>
                    <span class="font-medium">Lease Duration:</span> {{request.leaseDuration}}
                  </div>
                </div>

                <p class="text-gray-700 text-sm">{{request.message}}</p>
              </div>

              <div class="flex flex-col items-end gap-2 ml-6">
                <span [ngClass]="getStatusClass(request.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                  <lucide-icon [img]="Clock" class="w-3 h-3 inline mr-1" *ngIf="request.status === 'Pending'"></lucide-icon>
                  {{request.status}}
                </span>
                
                <div class="flex gap-2" *ngIf="request.status === 'Pending'">
                  <button (click)="updateBookingStatus(request.id, 'Approved')" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1">
                    <lucide-icon [img]="Check" class="w-4 h-4"></lucide-icon>
                    Approve
                  </button>
                  <button (click)="openRejectModal(request)" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-1">
                    <lucide-icon [img]="X" class="w-4 h-4"></lucide-icon>
                    Reject
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
    .min-h-screen { min-height: 100vh; }
    .pt-20 { padding-top: 5rem; }
    .pb-8 { padding-bottom: 2rem; }
    .bg-gray-50 { background-color: #f9fafb; }
    .max-w-6xl { max-width: 72rem; }
    .mx-auto { margin: 0 auto; }
    .px-4 { padding: 0 1rem; }
    .text-3xl { font-size: 1.875rem; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .text-gray-900 { color: #111827; }
    .text-gray-600 { color: #4b5563; }
    .text-gray-700 { color: #374151; }
    .text-gray-500 { color: #6b7280; }
    .text-indigo-600 { color: #4f46e5; }
    .text-white { color: white; }
    .mb-8 { margin-bottom: 2rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-1 { margin-bottom: 0.25rem; }
    .space-y-4 > * + * { margin-top: 1rem; }
    .bg-white { background-color: white; }
    .bg-indigo-100 { background-color: #e0e7ff; }
    .bg-green-600 { background-color: #059669; }
    .bg-red-600 { background-color: #dc2626; }
    .bg-yellow-100 { background-color: #fef3c7; }
    .bg-green-100 { background-color: #dcfce7; }
    .bg-red-100 { background-color: #fee2e2; }
    .text-yellow-800 { color: #92400e; }
    .text-green-800 { color: #166534; }
    .text-red-800 { color: #991b1b; }
    .rounded-lg { border-radius: 0.5rem; }
    .rounded-full { border-radius: 9999px; }
    .rounded { border-radius: 0.25rem; }
    .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
    .p-6 { padding: 1.5rem; }
    .px-3 { padding: 0 0.75rem; }
    .py-1 { padding: 0.25rem 0; }
    .px-4 { padding: 0 1rem; }
    .py-2 { padding: 0.5rem 0; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .justify-between { justify-content: space-between; }
    .items-start { align-items: flex-start; }
    .items-center { align-items: center; }
    .items-end { align-items: flex-end; }
    .flex-1 { flex: 1; }
    .gap-2 { gap: 0.5rem; }
    .gap-3 { gap: 0.75rem; }
    .gap-4 { gap: 1rem; }
    .gap-1 { gap: 0.25rem; }
    .ml-6 { margin-left: 1.5rem; }
    .mr-1 { margin-right: 0.25rem; }
    .w-10 { width: 2.5rem; }
    .h-10 { height: 2.5rem; }
    .w-5 { width: 1.25rem; }
    .h-5 { height: 1.25rem; }
    .w-4 { width: 1rem; }
    .h-4 { height: 1rem; }
    .w-3 { width: 0.75rem; }
    .h-3 { height: 0.75rem; }
    .grid { display: grid; }
    .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
    .text-sm { font-size: 0.875rem; }
    .text-xs { font-size: 0.75rem; }
    .inline { display: inline; }
    .hover\\:bg-green-700:hover { background-color: #047857; }
    .hover\\:bg-red-700:hover { background-color: #b91c1c; }
    .text-center { text-align: center; }
    .py-8 { padding: 2rem 0; }
    
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
  `]
})
export class BookingRequestsComponent implements OnInit {
  readonly Check = Check;
  readonly X = X;
  readonly Clock = Clock;
  readonly User = User;
  readonly ArrowLeft = ArrowLeft;

  bookingRequests: any[] = [];
  loading = false;
  showRejectModal = false;
  selectedRequest: any = null;
  rejectReason = '';

  constructor(
    private ownerService: OwnerService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBookingRequests();
  }

  loadBookingRequests() {
    this.loading = true;
    // Mock data for UI testing - immediate load
    this.bookingRequests = [
      {
        id: 1,
        tenantName: 'John Smith',
        tenantEmail: 'john.smith@email.com',
        propertyTitle: 'Modern Downtown Apartment',
        propertyLocation: 'Downtown, NYC',
        rent: 2500,
        moveInDate: 'March 15, 2024',
        leaseDuration: '12 months',
        message: 'I am very interested in this property. I have stable income and excellent references from my previous landlord.',
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
        message: 'Looking for a short-term lease while I complete my graduate studies. I have good credit score and can provide references.',
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
        message: 'Interested in a long-term lease. I can provide first and last month rent upfront plus security deposit.',
        status: 'Rejected'
      },
      {
        id: 4,
        tenantName: 'Emma Wilson',
        tenantEmail: 'emma.wilson@email.com',
        propertyTitle: 'Suburban Family Home',
        propertyLocation: 'Queens, NY',
        rent: 3200,
        moveInDate: 'April 15, 2024',
        leaseDuration: '18 months',
        message: 'Family of four looking for a safe neighborhood. Both parents are working professionals with stable employment.',
        status: 'Pending'
      }
    ];
    this.loading = false;
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
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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