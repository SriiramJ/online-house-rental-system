import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarOpenSubject = new BehaviorSubject<boolean>(window.innerWidth >= 1024);
  public sidebarOpen$ = this.sidebarOpenSubject.asObservable();

  constructor() {
    // Listen for window resize to auto-close sidebar on mobile
    window.addEventListener('resize', () => {
      if (window.innerWidth < 1024) {
        this.sidebarOpenSubject.next(false);
      }
    });
  }

  toggle() {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  open() {
    this.sidebarOpenSubject.next(true);
  }

  close() {
    this.sidebarOpenSubject.next(false);
  }

  get isOpen(): boolean {
    return this.sidebarOpenSubject.value;
  }
}