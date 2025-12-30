import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Home } from 'lucide-angular';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="empty-state">
      <div class="empty-state-content">
        <lucide-icon [img]="Home" class="empty-state-icon"></lucide-icon>
        <h3 class="empty-state-title">{{ title }}</h3>
        <p class="empty-state-message">{{ message }}</p>
        <button 
          *ngIf="actionText" 
          (click)="onAction()" 
          class="empty-state-action"
        >
          {{ actionText }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
      padding: 2rem;
    }

    .empty-state-content {
      text-align: center;
      max-width: 400px;
    }

    .empty-state-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1rem;
      color: #9ca3af;
      display: block;
    }

    .empty-state-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .empty-state-message {
      color: #6b7280;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    .empty-state-action {
      padding: 0.75rem 1.5rem;
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .empty-state-action:hover {
      background: #3730a3;
    }
  `]
})
export class EmptyStateComponent {
  @Input() title: string = 'No items found';
  @Input() message: string = 'Try adjusting your search criteria';
  @Input() actionText: string = '';
  @Output() action = new EventEmitter<void>();

  readonly Home = Home;

  onAction() {
    this.action.emit();
  }
}