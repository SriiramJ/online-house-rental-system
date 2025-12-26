import { Routes } from '@angular/router';

import { BookingRequest } from './bookings/booking-request/booking-request';
import { OwnerDashboard } from './owner/owner-dashboard/owner-dashboard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LandingComponent } from './public/landing/landing.component';
import { PropertiesComponent } from './public/properties/properties.component';
import { PropertyDetailsComponent } from './public/property-details/property-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { AuthGuard, OwnerGuard, TenantGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'properties', component: PropertiesComponent },
  { path: 'property-details/:id', component: PropertyDetailsComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'properties/:id/book', component: BookingRequest, canActivate: [AuthGuard] },
      { path: 'owner/dashboard', component: OwnerDashboard, canActivate: [OwnerGuard] },
    ]
  },
];