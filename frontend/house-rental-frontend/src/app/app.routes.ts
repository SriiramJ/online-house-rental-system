import { Routes } from '@angular/router';

import { BookingRequest } from './bookings/booking-request/booking-request';
import { OwnerDashboardComponent } from './owner/owner-dashboard/owner-dashboard.component';
import { AddPropertyComponent } from './owner/add-property/add-property.component';
import { MyPropertiesComponent } from './owner/owner/my-properties/my-properties.component';
import { BookingRequestsComponent } from './owner/owner/booking-requests/booking-requests.component';
import { MyTenantsComponent } from './owner/owner/my-tenants/my-tenants.component';
import { MyBookingsComponent } from './tenant/my-bookings/my-bookings.component';
import { TenantDashboardComponent } from './tenant/tenant-dashboard/tenant-dashboard.component';
import { TenantBookingsComponent } from './tenant/tenant-bookings/tenant-bookings.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { LandingComponent } from './public/landing/landing.component';
import { PropertiesComponent } from './public/properties/properties.component';
import { PropertyDetailsComponent } from './public/property-details/property-details.component';
import { HelpCenterComponent } from './public/help-center/help-center.component';
import { ContactComponent } from './public/contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { AuthGuard, OwnerGuard, TenantGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  // Public routes
  { path: '', component: LandingComponent },
  { path: 'properties', component: PropertiesComponent },
  { path: 'property-details/:id', component: PropertyDetailsComponent },
  { path: 'help-center', component: HelpCenterComponent },
  { path: 'contact', component: ContactComponent },
  
  // Auth routes (redirect authenticated users)
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'auth/login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'auth/register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent, canActivate: [NoAuthGuard] },
  { path: 'auth/reset-password', component: ResetPasswordComponent, canActivate: [NoAuthGuard] },
  
  // Tenant-only routes
  { path: 'dashboard', component: TenantDashboardComponent, canActivate: [TenantGuard] },
  { path: 'tenant/dashboard', component: TenantDashboardComponent, canActivate: [TenantGuard] },
  { path: 'tenant/bookings', component: TenantBookingsComponent, canActivate: [TenantGuard] },
  
  // Owner-only routes
  { path: 'owner/dashboard', component: OwnerDashboardComponent, canActivate: [OwnerGuard] },
  { path: 'owner/add-property', component: AddPropertyComponent, canActivate: [OwnerGuard] },
  { path: 'owner/add-property/:id', component: AddPropertyComponent, canActivate: [OwnerGuard] },
  { path: 'owner/properties', component: MyPropertiesComponent, canActivate: [OwnerGuard] },
  { path: 'owner/booking-requests', component: BookingRequestsComponent, canActivate: [OwnerGuard] },
  { path: 'owner/tenants', component: MyTenantsComponent, canActivate: [OwnerGuard] },
  
  // Nested routes with layout
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'properties/:id/book', component: BookingRequest, canActivate: [TenantGuard] },
    ]
  },
];