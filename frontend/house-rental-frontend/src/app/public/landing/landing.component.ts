import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/button/button.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { PropertyService, Property } from '../../core/services/property.service';
import { BookingStateService } from '../../core/services/booking-state.service';
import { AuthStateService } from '../../core/services/auth-state.service';
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
    private authState: AuthStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isLoggedIn = !!this.authState.getToken();
    this.loadFeaturedProperties();
    this.subscribeToBookingUpdates();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  subscribeToBookingUpdates() {
    this.bookingStateService.propertyUpdates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(update => {
        if (update) {
          const property = this.featuredProperties.find(p => p.id === update.id);
          if (property) {
            property.is_available = update.is_available;
            this.cdr.detectChanges();
          }
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