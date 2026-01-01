import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PropertyService, Property } from '../../core/services/property.service';
import { BookingStateService } from '../../core/services/booking-state.service';
import { PropertyStateService } from '../../core/services/property-state.service';
import { ToastService } from '../../core/services/toast.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LucideAngularModule, Search, Filter, MapPin, Bed, Bath, AlertTriangle, Home, Building, Eye, DollarSign } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    LoaderComponent, 
    EmptyStateComponent,
    NavbarComponent,
    FooterComponent,
    LucideAngularModule
  ],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit, OnDestroy {
  properties: Property[] = [];
  filteredProperties: Property[] = [];
  loading = false;
  error = '';
  private destroy$ = new Subject<void>();
  
  // Search and filters
  searchTerm = '';
  showFilters = false;
  minRent = '';
  maxRent = '';
  minBedrooms = '';
  location = '';
  selectedType = '';
  
  propertyTypes = ['All', 'Apartment', 'House', 'Condo', 'Studio'];
  bedroomOptions = ['Any', '1+', '2+', '3+', '4+', '5+'];

  // Lucide icons
  readonly Search = Search;
  readonly Filter = Filter;
  readonly MapPin = MapPin;
  readonly Bed = Bed;
  readonly Bath = Bath;
  readonly AlertTriangle = AlertTriangle;
  readonly Home = Home;
  readonly Building = Building;
  readonly Eye = Eye;
  readonly DollarSign = DollarSign;

  constructor(
    private propertyService: PropertyService,
    private bookingStateService: BookingStateService,
    private propertyStateService: PropertyStateService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadProperties();
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
        this.loadProperties();
      });
  }

  subscribeToBookingUpdates() {
    this.bookingStateService.propertyUpdates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(update => {
        if (update) {
          const property = this.properties.find(p => p.id === update.id);
          if (property) {
            property.is_available = update.is_available;
            this.applyFilters();
            this.cdr.detectChanges();
          }
        }
      });

    // Also listen for general booking updates
    this.bookingStateService.bookingUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadProperties();
      });
  }

  loadProperties() {
    this.loading = true;
    this.error = '';
    this.properties = []; // Clear existing data
    this.filteredProperties = []; // Clear filtered data
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
        console.log('Raw properties response:', response);
        this.properties = response.properties.map(property => {
          console.log('Processing property:', property.title, 'Photos:', property.photos);
          
          // Get the first photo from the photos array
          let imageUrl = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'; // default
          
          if (property.photos && Array.isArray(property.photos) && property.photos.length > 0) {
            imageUrl = property.photos[0];
          } else if (property.photos && typeof property.photos === 'string' && property.photos.trim()) {
            // Handle case where photos is a comma-separated string
            const photoUrls = property.photos.split(',').map((url: string) => url.trim()).filter((url: string) => url);
            if (photoUrls.length > 0) {
              imageUrl = photoUrls[0];
            }
          }
          
          console.log('Final image URL for', property.title, ':', imageUrl);
          
          return {
            ...property,
            image: imageUrl,
            type: property.property_type,
            available: property.is_available
          };
        });
        console.log('Processed properties:', this.properties);
        this.filteredProperties = [...this.properties];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.error = 'Failed to load properties';
        this.toast.error('Failed to load properties', 'Please check your connection and try again.');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters() {
    this.filteredProperties = this.properties.filter(property => {
      const matchesSearch = !this.searchTerm ||
        property.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType = !this.selectedType || this.selectedType === 'All' || property.property_type === this.selectedType;
      const matchesMinRent = !this.minRent || property.rent >= parseInt(this.minRent);
      const matchesMaxRent = !this.maxRent || property.rent <= parseInt(this.maxRent);
      const matchesMinBedrooms = !this.minBedrooms || property.bedrooms >= parseInt(this.minBedrooms);
      const matchesLocation = !this.location || property.location.toLowerCase().includes(this.location.toLowerCase());

      return matchesSearch && matchesType && matchesMinRent && matchesMaxRent && matchesMinBedrooms && matchesLocation;
    });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  onSearchChange() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedType = '';
    this.minRent = '';
    this.maxRent = '';
    this.minBedrooms = '';
    this.location = '';
    this.showFilters = false;
    this.filteredProperties = [...this.properties];
    this.toast.info('Filters cleared', 'Showing all available properties');
  }

  viewProperty(propertyId: number) {
    this.router.navigate(['/property-details', propertyId]);
  }

  retry() {
    this.loadProperties();
  }
}