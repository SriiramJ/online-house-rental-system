import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { OwnerService } from '../../../core/services/owner.service';
import { ToastService } from '../../../core/services/toast.service';
import { LucideAngularModule, User, Phone, Mail, MapPin, Calendar, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-my-tenants',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, LucideAngularModule],
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
        <h1 class="text-3xl font-bold text-gray-900 mb-8">My Tenants</h1>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngIf="loading" class="col-span-full text-center py-8">
            Loading tenants...
          </div>
          <div *ngFor="let tenant of tenants" class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <lucide-icon [img]="User" class="w-8 h-8 text-indigo-600"></lucide-icon>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">{{tenant.name}}</h3>
                <span [ngClass]="tenant.status === 'Active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'" 
                      class="px-2 py-1 rounded-full text-xs font-medium">
                  {{tenant.status}}
                </span>
              </div>
            </div>

            <div class="space-y-3 mb-4">
              <div class="flex items-center gap-2 text-gray-600">
                <lucide-icon [img]="Mail" class="w-4 h-4"></lucide-icon>
                <span class="text-sm">{{tenant.email}}</span>
              </div>
              <div class="flex items-center gap-2 text-gray-600">
                <lucide-icon [img]="Phone" class="w-4 h-4"></lucide-icon>
                <span class="text-sm">{{tenant.phone}}</span>
              </div>
              <div class="flex items-center gap-2 text-gray-600">
                <lucide-icon [img]="MapPin" class="w-4 h-4"></lucide-icon>
                <span class="text-sm">{{tenant.propertyTitle}}</span>
              </div>
              <div class="flex items-center gap-2 text-gray-600">
                <lucide-icon [img]="Calendar" class="w-4 h-4"></lucide-icon>
                <span class="text-sm">Lease: {{tenant.leaseStart}} - {{tenant.leaseEnd}}</span>
              </div>
            </div>

            <div class="border-t pt-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-500">Monthly Rent</span>
                <span class="font-semibold text-indigo-600">\${{tenant.rent}}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">Next Payment</span>
                <span class="text-sm font-medium" [ngClass]="isPaymentOverdue(tenant.nextPayment) ? 'text-red-600' : 'text-gray-900'">
                  {{tenant.nextPayment}}
                </span>
              </div>
            </div>

            <div class="mt-4 flex gap-2">
              <button class="flex-1 bg-indigo-100 text-indigo-700 px-3 py-2 rounded hover:bg-indigo-200 text-sm">
                Contact
              </button>
              <button class="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 text-sm">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-footer></app-footer>
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
    .text-xl { font-size: 1.25rem; }
    .text-sm { font-size: 0.875rem; }
    .text-xs { font-size: 0.75rem; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .text-gray-900 { color: #111827; }
    .text-gray-600 { color: #4b5563; }
    .text-gray-700 { color: #374151; }
    .text-gray-500 { color: #6b7280; }
    .text-indigo-600 { color: #4f46e5; }
    .text-indigo-700 { color: #3730a3; }
    .text-green-600 { color: #059669; }
    .text-red-600 { color: #dc2626; }
    .mb-8 { margin-bottom: 2rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mt-4 { margin-top: 1rem; }
    .pt-4 { padding-top: 1rem; }
    .grid { display: grid; }
    .gap-6 { gap: 1.5rem; }
    .gap-4 { gap: 1rem; }
    .gap-3 { gap: 0.75rem; }
    .gap-2 { gap: 0.5rem; }
    .bg-white { background-color: white; }
    .bg-indigo-100 { background-color: #e0e7ff; }
    .bg-gray-100 { background-color: #f3f4f6; }
    .bg-green-100 { background-color: #dcfce7; }
    .bg-red-100 { background-color: #fee2e2; }
    .rounded-lg { border-radius: 0.5rem; }
    .rounded-full { border-radius: 9999px; }
    .rounded { border-radius: 0.25rem; }
    .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
    .p-6 { padding: 1.5rem; }
    .px-2 { padding: 0 0.5rem; }
    .py-1 { padding: 0.25rem 0; }
    .px-3 { padding: 0 0.75rem; }
    .py-2 { padding: 0.5rem 0; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .flex-1 { flex: 1; }
    .w-16 { width: 4rem; }
    .h-16 { height: 4rem; }
    .w-8 { width: 2rem; }
    .h-8 { height: 2rem; }
    .w-4 { width: 1rem; }
    .h-4 { height: 1rem; }
    .space-y-3 > * + * { margin-top: 0.75rem; }
    .border-t { border-top: 1px solid #e5e7eb; }
    .hover\\:bg-indigo-200:hover { background-color: #c7d2fe; }
    .hover\\:bg-gray-200:hover { background-color: #e5e7eb; }
    
    @media (min-width: 768px) {
      .md\\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 1024px) {
      .lg\\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
    }
    .col-span-full { grid-column: 1 / -1; }
    .text-center { text-align: center; }
    .py-8 { padding: 2rem 0; }
  `]
})
export class MyTenantsComponent implements OnInit {
  readonly User = User;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly MapPin = MapPin;
  readonly Calendar = Calendar;

  tenants: any[] = [];
  loading = false;

  readonly ArrowLeft = ArrowLeft;

  constructor(
    private ownerService: OwnerService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTenants();
  }

  loadTenants() {
    this.loading = true;
    // Mock data for UI testing - immediate load
    this.tenants = [
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
        status: 'Active'
      },
      {
        id: 4,
        name: 'David Thompson',
        email: 'david.t@email.com',
        phone: '+1 (555) 321-9876',
        propertyTitle: 'Luxury Penthouse Suite',
        rent: 5500,
        leaseStart: 'Jan 15, 2024',
        leaseEnd: 'Jan 14, 2026',
        nextPayment: 'Mar 15, 2024',
        status: 'Active'
      },
      {
        id: 5,
        name: 'Lisa Park',
        email: 'lisa.park@email.com',
        phone: '+1 (555) 654-3210',
        propertyTitle: 'Garden View Apartment',
        rent: 2200,
        leaseStart: 'Nov 1, 2023',
        leaseEnd: 'Oct 31, 2024',
        nextPayment: 'Feb 25, 2024',
        status: 'Active'
      }
    ];
    this.loading = false;
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