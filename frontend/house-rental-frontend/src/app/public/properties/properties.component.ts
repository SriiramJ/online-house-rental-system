import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PropertyService, Property } from '../../core/services/property.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LucideAngularModule, Search, Filter, MapPin, Bed, Bath, AlertTriangle, Home, Building, Eye, DollarSign } from 'lucide-angular';

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
export class PropertiesComponent implements OnInit {
  properties: Property[] = [];
  filteredProperties: Property[] = [];
  loading = false;
  error = '';
  
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
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    this.loading = true;
    this.error = '';
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
        this.properties = response.properties.map(property => ({
          ...property,
          image: property.photos && property.photos.length > 0 
            ? property.photos[0] 
            : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
          type: property.property_type,
          available: property.is_available
        }));
        this.filteredProperties = [...this.properties];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.error = 'Failed to load properties';
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
  }

  viewProperty(propertyId: number) {
    this.router.navigate(['/property-details', propertyId]);
  }

  retry() {
    this.loadProperties();
  }
}