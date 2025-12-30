import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="dashboard-container">
      <div class="dashboard-content">
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard!</p>
      </div>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f9fafb;
      padding-top: 70px;
    }
    
    .dashboard-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 1rem;
    }
  `]
})
export class DashboardComponent {}