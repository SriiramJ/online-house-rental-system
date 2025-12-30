import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener, ElementRef } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { AuthService } from '../../core/services/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LucideAngularModule, Building2, User as UserIcon, ChevronDown, Menu, X } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  showUserMenu = false;

  // Lucide icons
  readonly Building2 = Building2;
  readonly UserIcon = UserIcon;
  readonly ChevronDown = ChevronDown;
  readonly Menu = Menu;
  readonly X = X;

  constructor(
    private router: Router,
    public authService: AuthService,
    public sidebarService: SidebarService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.trackRoute();
    this.subscribeToAuthChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  subscribeToAuthChanges() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cdr.detectChanges();
      });
  }

  trackRoute() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.cdr.detectChanges();
      });
  }

  isOnDashboardPage(): boolean {
    const url = this.router.url;
    return url === '/dashboard' || url === '/owner/dashboard' || url === '/tenant/dashboard';
  }

  isOnPropertiesPage(): boolean {
    return this.router.url === '/properties';
  }

  isOnLandingPage(): boolean {
    return this.router.url === '/';
  }

  isOnBookingRequestsPage(): boolean {
    return false;
  }

  isOnPropertyDetailsPage(): boolean {
    return this.router.url.includes('/property-details');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showUserMenu = false;
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  browseProperties() {
    this.router.navigate(['/properties']);
  }

  goToDashboard() {
    if (this.authService.isOwner()) {
      this.router.navigate(['/owner/dashboard']);
    } else {
      this.router.navigate(['/tenant/dashboard']);
    }
  }

  login() {
    this.router.navigate(['/auth/login']);
  }

  register() {
    this.router.navigate(['/auth/register']);
  }

  logout() {
    this.showUserMenu = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }
}