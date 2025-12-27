import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { OwnerService } from '../../../core/services/owner.service';
import { ToastService } from '../../../core/services/toast.service';
import { LucideAngularModule, Plus, Edit, Trash2, Eye, ArrowLeft, MapPin, Bed, Bath, Maximize, Home as HomeIcon } from 'lucide-angular';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, LucideAngularModule],
  templateUrl: './my-properties.component.html',
  styleUrls: ['./my-properties.component.css']
})
export class MyPropertiesComponent implements OnInit {
  readonly Plus = Plus;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly Eye = Eye;
  readonly ArrowLeft = ArrowLeft;
  readonly MapPin = MapPin;
  readonly Bed = Bed;
  readonly Bath = Bath;
  readonly Maximize = Maximize;
  readonly HomeIcon = HomeIcon;

  properties: any[] = [];
  loading = false;
  showDeleteModal = false;
  propertyToDelete: any = null;

  constructor(
    private ownerService: OwnerService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    this.loading = true;
    // Mock data for UI testing - immediate load
    this.properties = [
      {
        id: 1,
        title: 'Modern Downtown Apartment',
        description: 'Beautiful 2-bedroom apartment in the heart of downtown',
        location: 'Downtown, New York',
        rent: 2500,
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        status: 'Available',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'
      },
      {
        id: 2,
        title: 'Cozy Suburban House',
        description: 'Spacious 3-bedroom house with beautiful garden',
        location: 'Suburbia, California',
        rent: 3200,
        bedrooms: 3,
        bathrooms: 2,
        area: 1800,
        status: 'Rented',
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400'
      },
      {
        id: 3,
        title: 'Luxury Penthouse Suite',
        description: 'Stunning 4-bedroom villa with private pool',
        location: 'Upper East Side, New York',
        rent: 5500,
        bedrooms: 4,
        bathrooms: 3,
        area: 2500,
        status: 'Available',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'
      }
    ];
    this.loading = false;
  }

  getAvailableCount(): number {
    return this.properties.filter(p => p.status === 'Available').length;
  }

  getOccupiedCount(): number {
    return this.properties.filter(p => p.status === 'Rented').length;
  }

  handleDeleteClick(property: any) {
    this.propertyToDelete = property;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.propertyToDelete = null;
  }

  confirmDelete() {
    if (this.propertyToDelete) {
      this.properties = this.properties.filter(p => p.id !== this.propertyToDelete.id);
      this.toast.success('Property deleted successfully');
      this.showDeleteModal = false;
      this.propertyToDelete = null;
    }
  }

  goToDashboard() {
    this.router.navigate(['/owner/dashboard']);
  }
}