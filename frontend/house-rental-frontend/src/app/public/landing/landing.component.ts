import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/button/button.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { PropertyService, Property } from '../../core/services/property.service';
import { BookingStateService } from '../../core/services/booking-state.service';
import { PropertyStateService } from '../../core/services/property-state.service';
import { AuthService } from '../../core/services/auth.service';
import { LucideAngularModule, Search, Home, Users } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ButtonComponent, NavbarComponent, FooterComponent, LucideAngularModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  featuredProperties: Property[] = [];
  loading = false;
  error = '';
  isLoggedIn = false;
  private destroy$ = new Subject<void>();

  // Lucide icons
  readonly Search = Search;
  readonly Home = Home;
  readonly Users = Users;

  constructor(
    private router: Router,
    private propertyService: PropertyService,
    private bookingStateService: BookingStateService,
    private propertyStateService: PropertyStateService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.loadFeaturedProperties();
    this.subscribeToBookingUpdates();
    this.subscribeToPropertyUpdates();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  subscribeToPropertyUpdates() {
    this.propertyStateService.propertiesUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('Landing page: Properties updated, refreshing');
        this.loadFeaturedProperties();
      });
  }

  subscribeToBookingUpdates() {
    this.bookingStateService.propertyUpdates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(update => {
        if (update) {
          console.log('Landing: Property update received', update);
          // Reload properties to get fresh data from server
          this.loadFeaturedProperties();
        }
      });
  }

  loadFeaturedProperties() {
    this.loading = true;
    this.error = '';
    this.featuredProperties = [];
    this.cdr.detectChanges();
    
    // Timeout fallback
    setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.cdr.detectChanges();
      }
    }, 3000);
    
    this.propertyService.getProperties().subscribe({
      next: (response) => {
        if (response && response.properties && response.properties.length > 0) {
          // Show all properties but mark availability status
          this.featuredProperties = response.properties.slice(0, 3).map(property => ({
            ...property,
            image: property.photos && property.photos.length > 0 
              ? property.photos[0] 
              : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'
          }));
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  browseProperties() {
    this.router.navigate(['/properties']);
  }

  login() {
    this.router.navigate(['/auth/login']);
  }

  register() {
    this.router.navigate(['/auth/register']);
  }

  viewProperty(id: number) {
    this.router.navigate(['/property-details', id]);
  }
}