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
import { ErrorDisplayComponent } from '../../shared/components/error-display/error-display.component';
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
    ErrorDisplayComponent,
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
  paginatedProperties: Property[] = [];
  loading = false;
  retrying = false;
  error = '';
  private destroy$ = new Subject<void>();
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;
  
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
        console.log('Browse properties: Properties updated, refreshing');
        this.loadProperties();
      });
  }

  subscribeToBookingUpdates() {
    this.bookingStateService.propertyUpdates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(update => {
        if (update) {
          console.log('Browse properties: Property update received', update);
          // Reload properties to get fresh data from server
          this.loadProperties();
        }
      });
  }

  loadProperties() {
    this.loading = true;
    this.error = '';
    this.properties = [];
    this.filteredProperties = [];
    this.cdr.detectChanges();
    
    this.propertyService.getProperties().subscribe({
      next: (response) => {
        console.log('Raw properties response:', response);
        
        if (!response.success) {
          this.error = response.message;
          this.toast.error('Error', response.message);
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }
        
        this.properties = response.properties.map(property => {
          let imageUrl = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400';
          
          if (property.photos && Array.isArray(property.photos) && property.photos.length > 0) {
            imageUrl = property.photos[0];
          } else if (property.photos && typeof property.photos === 'string' && property.photos.trim()) {
            const photoUrls = property.photos.split(',').map((url: string) => url.trim()).filter((url: string) => url);
            if (photoUrls.length > 0) {
              imageUrl = photoUrls[0];
            }
          }
          
          return {
            ...property,
            image: imageUrl,
            type: property.property_type,
            available: property.status === 'Available'
          };
        });
        
        this.filteredProperties = [...this.properties];
        this.updatePagination();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.error = error.message || 'Failed to load properties';
        this.toast.error('Failed to load properties', error.message || 'Please check your connection and try again.');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters() {
    // Show all properties, don't filter by status
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
    this.currentPage = 1;
    this.updatePagination();
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
    this.filteredProperties = [...this.properties]; // Show all properties
    this.currentPage = 1;
    this.updatePagination();
    this.toast.info('Filters cleared', 'Showing all properties');
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredProperties.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProperties = this.filteredProperties.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  viewProperty(propertyId: number) {
    this.router.navigate(['/property-details', propertyId]);
  }

  retry() {
    this.retrying = true;
    this.loadProperties();
    setTimeout(() => {
      this.retrying = false;
    }, 1000);
  }
}