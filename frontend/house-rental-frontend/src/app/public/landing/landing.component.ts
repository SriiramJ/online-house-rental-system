import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  featuredProperties = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      title: 'Modern Downtown Apartment',
      location: 'Downtown, NYC',
      rent: 2500,
      bedrooms: 2,
      bathrooms: 2
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      title: 'Cozy Suburban House',
      location: 'Brooklyn, NYC',
      rent: 3200,
      bedrooms: 3,
      bathrooms: 2
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      title: 'Luxury Villa with Pool',
      location: 'Queens, NYC',
      rent: 4500,
      bedrooms: 4,
      bathrooms: 3
    }
  ];

  constructor(private router: Router) {}

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
    this.router.navigate(['/properties', id]);
  }
}