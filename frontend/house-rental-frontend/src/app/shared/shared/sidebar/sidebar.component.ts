import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

export interface SidebarItem {
  label: string;
  route: string;
  icon: any;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="sidebar-overlay" [class.sidebar-open]="isOpen" (click)="onToggle()"></div>
    
    <div class="sidebar" [class.sidebar-open]="isOpen">
      <div class="sidebar-header">
        <h2>{{title}}</h2>
      </div>
      <nav class="sidebar-nav">
        <a 
          *ngFor="let item of items" 
          [routerLink]="item.route" 
          class="nav-item"
          [class.active]="item.active"
          routerLinkActive="active">
          <lucide-icon [img]="item.icon" class="nav-icon"></lucide-icon>
          {{item.label}}
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .sidebar-overlay.sidebar-open {
      opacity: 1;
      visibility: visible;
    }

    @media (min-width: 1024px) {
      .sidebar-overlay {
        display: none;
      }
    }

    .sidebar {
      width: 280px;
      position: absolute;
      left: -280px;
      top: 0;
      bottom: 0;
      overflow-y: auto;
      z-index: 1000;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: white;
      border-right: 1px solid #e5e7eb;
    }

    .sidebar.sidebar-open {
      left: 0;
    }

    /* Desktop (≥1024px) */
    @media (min-width: 1024px) {
      .sidebar {
        left: 0;
        box-shadow: none;
        border-right: 1px solid #e5e7eb;
      }
      
      .sidebar:not(.sidebar-open) {
        left: -280px;
      }
    }

    /* Tablet (768px-1023px) */
    @media (min-width: 768px) and (max-width: 1023px) {
      .sidebar {
        left: -280px;
        box-shadow: 4px 0 12px rgba(0,0,0,0.15);
      }
      
      .sidebar.sidebar-open {
        left: 0;
      }
    }

    /* Mobile (<768px) */
    @media (max-width: 767px) {
      .sidebar {
        width: 100vw;
        left: -100vw;
        box-shadow: none;
        border-right: none;
      }
      
      .sidebar.sidebar-open {
        left: 0;
      }
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      background: #f8fafc;
    }

    .sidebar-header h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .sidebar-nav {
      padding: 0.75rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      margin-bottom: 0.25rem;
      color: #6b7280;
      text-decoration: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .nav-item:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .nav-item.active {
      background: #eef2ff;
      color: #4f46e5;
      font-weight: 600;
    }

    .nav-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
  `]
})
export class SidebarComponent {
  @Input() title: string = '';
  @Input() items: SidebarItem[] = [];
  @Input() isOpen: boolean = true;
  @Input() toggleIcon: any;
  @Output() toggle = new EventEmitter<void>();

  onToggle() {
    this.toggle.emit();
  }
}