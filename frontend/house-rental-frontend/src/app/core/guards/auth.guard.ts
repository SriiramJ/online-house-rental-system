import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.toast.warning('Authentication Required', 'Please log in to access this page.');
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class OwnerGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.toast.warning('Authentication Required', 'Please log in to access this page.');
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    
    if (this.authService.isOwner()) {
      return true;
    }
    
    if (this.authService.isTenant()) {
      this.toast.error('Access Denied', 'This page is only accessible to property owners.');
      this.router.navigate(['/dashboard']);
      return false;
    }
    
    this.toast.error('Access Denied', 'Invalid user role.');
    this.router.navigate(['/auth/login']);
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TenantGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.toast.warning('Authentication Required', 'Please log in to access this page.');
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    
    if (this.authService.isTenant()) {
      return true;
    }
    
    if (this.authService.isOwner()) {
      this.toast.error('Access Denied', 'This page is only accessible to tenants.');
      this.router.navigate(['/owner/dashboard']);
      return false;
    }
    
    this.toast.error('Access Denied', 'Invalid user role.');
    this.router.navigate(['/auth/login']);
    return false;
  }
}