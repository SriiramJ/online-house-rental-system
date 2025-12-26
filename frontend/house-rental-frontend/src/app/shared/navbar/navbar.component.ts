import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { UserService, User } from '../../core/services/user.service';
import { AuthStateService } from '../../core/services/auth-state.service';
import { AuthService } from '../../core/services/auth.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LucideAngularModule, Building2, User as UserIcon, ChevronDown } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUser: User | null = null;
  currentRoute = '';
  showUserMenu = false;
  private destroy$ = new Subject<void>();

  // Lucide icons
  readonly Building2 = Building2;
  readonly UserIcon = UserIcon;
  readonly ChevronDown = ChevronDown;

  constructor(
    private router: Router,
    private userService: UserService,
    private authState: AuthStateService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.trackRoute();
    this.subscribeToAuthState();
    
    // Force check auth state on init
    const token = this.authState.getToken();
    if (token) {
      this.isLoggedIn = true;
      this.loadCurrentUser();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  subscribeToAuthState() {
    this.authState.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoggedIn => {
        console.log('Auth state changed:', isLoggedIn);
        this.isLoggedIn = isLoggedIn;
        if (isLoggedIn) {
          this.loadCurrentUser();
        } else {
          this.currentUser = null;
        }
        this.cdr.detectChanges();
      });
  }

  loadCurrentUser() {
    console.log('Loading current user...');
    this.userService.getCurrentUser().subscribe({
      next: (response) => {
        console.log('User loaded:', response);
        this.currentUser = response.data;
        this.userService.setCurrentUser(response.data);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load user:', error);
        this.authState.clearToken();
        this.cdr.detectChanges();
      }
    });
  }

  trackRoute() {
    this.currentRoute = this.router.url;
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  browseProperties() {
    this.router.navigate(['/properties']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
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
    this.currentUser = null;
    this.userService.clearCurrentUser();
    this.authState.clearToken();
    this.router.navigate(['/']);
  }
}