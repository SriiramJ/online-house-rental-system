import { Routes } from '@angular/router';

import { PropertyList } from './properties/property-list/property-list';
import { PropertyDetails } from './properties/property-details/property-details';
import { BookingRequest } from './bookings/booking-request/booking-request';
import { OwnerDashboard } from './owner/owner-dashboard/owner-dashboard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LandingComponent } from './public/landing/landing.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { AuthGuard, OwnerGuard, TenantGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'properties', component: PropertyList },
      { path: 'properties/:id', component: PropertyDetails },
      { path: 'properties/:id/book', component: BookingRequest, canActivate: [AuthGuard] },
      { path: 'owner/dashboard', component: OwnerDashboard, canActivate: [OwnerGuard] },
      { path: 'auth/login', component: LoginComponent },
      { path: 'auth/register', component: RegisterComponent },
    ]
  },
];