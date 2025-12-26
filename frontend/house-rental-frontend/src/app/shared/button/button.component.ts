import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'xl' | 'icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [class]="getButtonClasses()"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn-base {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      white-space: nowrap;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 700;
      transition: all 0.15s ease-in-out;
      outline: none;
      cursor: pointer;
      border: none;
    }
    .btn-base:disabled {
      pointer-events: none;
      opacity: 0.5;
    }
    .btn-base:focus-visible {
      ring: 2px solid;
      ring-offset: 2px;
    }
    
    .btn-default {
      background-color: #4f46e5;
      color: white;
    }
    .btn-default:hover:not(:disabled) {
      background-color: #4338ca;
    }
    
    .btn-destructive {
      background-color: #dc2626;
      color: white;
    }
    .btn-destructive:hover:not(:disabled) {
      background-color: #b91c1c;
    }
    
    .btn-outline {
      border: 1px solid #d1d5db;
      background-color: white;
      color: #374151;
    }
    .btn-outline:hover:not(:disabled) {
      background-color: #f9fafb;
    }
    
    .btn-secondary {
      background-color: #f3f4f6;
      color: #111827;
    }
    .btn-secondary:hover:not(:disabled) {
      background-color: #e5e7eb;
    }
    
    .btn-ghost {
      background-color: transparent;
      color: #374151;
      font-weight: 700;
    }
    .btn-ghost:hover:not(:disabled) {
      background-color: transparent;
      color: #4f46e5;
    }
    
    .btn-link {
      background-color: transparent;
      color: #4f46e5;
      text-decoration: underline;
      text-underline-offset: 4px;
    }
    .btn-link:hover:not(:disabled) {
      text-decoration: underline;
    }
    
    .btn-default-size {
      height: 2.25rem;
      padding: 0.5rem 1rem;
    }
    .btn-sm {
      height: 2rem;
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
    }
    .btn-lg {
      height: 2.5rem;
      padding: 0.625rem 1.5rem;
    }
    .btn-xl {
      height: 3rem;
      padding: 0.75rem 2rem;
      font-size: 1rem;
    }
    .btn-icon {
      height: 2.25rem;
      width: 2.25rem;
      padding: 0;
    }
  `]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'default';
  @Input() size: ButtonSize = 'default';
  @Input() disabled = false;
  @Input() className = '';
  @Output() onClick = new EventEmitter<Event>();

  getButtonClasses(): string {
    const baseClass = 'btn-base';
    const variantClass = `btn-${this.variant}`;
    const sizeClass = this.size === 'default' ? 'btn-default-size' : `btn-${this.size}`;
    
    return `${baseClass} ${variantClass} ${sizeClass} ${this.className}`;
  }
}