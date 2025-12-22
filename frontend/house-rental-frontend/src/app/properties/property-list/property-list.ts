import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Property {
  id: number;
  title: string;
  location: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  type: string;
  available: boolean;
}

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-list.html',
  styleUrls: ['./property-list.css']
})
export class PropertyList implements OnInit {
  properties: Property[] = [];
  filteredProperties: Property[] = [];
  searchTerm = '';
  selectedType = '';
  minPrice = '';
  maxPrice = '';

  propertyTypes = ['All', 'Apartment', 'House', 'Condo', 'Studio'];

  constructor(public router: Router) {}

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    // Mock data - in a real app, this would come from an API
    this.properties = [
      {
        id: 1,
        title: 'Modern Downtown Apartment',
        location: 'Downtown, City Center',
        rent: 2500,
        bedrooms: 2,
        bathrooms: 2,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
        type: 'Apartment',
        available: true
      },
      {
        id: 2,
        title: 'Cozy Studio in Midtown',
        location: 'Midtown, Business District',
        rent: 1800,
        bedrooms: 1,
        bathrooms: 1,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        type: 'Studio',
        available: true
      },
      {
        id: 3,
        title: 'Spacious Family House',
        location: 'Suburb, Quiet Neighborhood',
        rent: 3500,
        bedrooms: 4,
        bathrooms: 3,
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
        type: 'House',
        available: true
      },
      {
        id: 4,
        title: 'Luxury Condo with City View',
        location: 'Uptown, Premium Area',
        rent: 4200,
        bedrooms: 3,
        bathrooms: 2,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
        type: 'Condo',
        available: false
      },
      {
        id: 5,
        title: 'Charming Garden Apartment',
        location: 'Garden District, Residential',
        rent: 2200,
        bedrooms: 2,
        bathrooms: 1,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
        type: 'Apartment',
        available: true
      },
      {
        id: 6,
        title: 'Modern Loft Space',
        location: 'Arts District, Trendy Area',
        rent: 2800,
        bedrooms: 1,
        bathrooms: 1,
        image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
        type: 'Apartment',
        available: true
      }
    ];

    this.filteredProperties = [...this.properties];
  }

  applyFilters() {
    this.filteredProperties = this.properties.filter(property => {
      const matchesSearch = !this.searchTerm ||
        property.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType = !this.selectedType || this.selectedType === 'All' || property.type === this.selectedType;

      const matchesMinPrice = !this.minPrice || property.rent >= parseInt(this.minPrice);
      const matchesMaxPrice = !this.maxPrice || property.rent <= parseInt(this.maxPrice);

      return matchesSearch && matchesType && matchesMinPrice && matchesMaxPrice;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onTypeChange() {
    this.applyFilters();
  }

  onPriceChange() {
    this.applyFilters();
  }

  viewProperty(propertyId: number) {
    this.router.navigate(['/properties', propertyId]);
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedType = '';
    this.minPrice = '';
    this.maxPrice = '';
    this.filteredProperties = [...this.properties];
  }
}