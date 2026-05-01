import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <span class="text-xl font-bold text-slate-900">SchoolBook</span>
          </a>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-6">
            <a routerLink="/services" routerLinkActive="text-indigo-600" class="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Services</a>
            @if (auth.isLoggedIn()) {
              @if (auth.isAdmin()) {
                <a routerLink="/admin/dashboard" routerLinkActive="text-indigo-600" class="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Admin</a>
              } @else {
                <a routerLink="/dashboard" routerLinkActive="text-indigo-600" class="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Dashboard</a>
                <a routerLink="/appointments" routerLinkActive="text-indigo-600" class="text-slate-600 hover:text-indigo-600 font-medium transition-colors">My Appointments</a>
              }
              <div class="relative">
                <button (click)="dropdownOpen.set(!dropdownOpen())" class="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100">
                  <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    @if (auth.user()?.avatar) {
                      <img [src]="auth.user()?.avatar" class="w-8 h-8 rounded-full object-cover" alt="avatar">
                    } @else {
                      <span class="text-indigo-700 font-semibold text-sm">{{ auth.user()?.name?.charAt(0)?.toUpperCase() }}</span>
                    }
                  </div>
                  <span class="text-slate-700 font-medium text-sm">{{ auth.user()?.name }}</span>
                  <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                @if (dropdownOpen()) {
                  <div class="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                    <a routerLink="/profile" (click)="dropdownOpen.set(false)" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      Profile
                    </a>
                    <hr class="my-1 border-slate-100">
                    <button (click)="onLogout()" class="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                      Log Out
                    </button>
                  </div>
                }
              </div>
            } @else {
              <a routerLink="/login" class="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Login</a>
              <a routerLink="/register" class="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">Get Started</a>
            }
          </div>

          <!-- Mobile menu btn -->
          <button (click)="mobileOpen.set(!mobileOpen())" class="md:hidden p-2 text-slate-500">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="mobileOpen() ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"/>
            </svg>
          </button>
        </div>

        <!-- Mobile menu -->
        @if (mobileOpen()) {
          <div class="md:hidden py-3 border-t border-slate-100">
            <a routerLink="/services" (click)="mobileOpen.set(false)" class="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg">Services</a>
            @if (auth.isLoggedIn()) {
              <a routerLink="/dashboard" (click)="mobileOpen.set(false)" class="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg">Dashboard</a>
              <a routerLink="/appointments" (click)="mobileOpen.set(false)" class="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg">My Appointments</a>
              <a routerLink="/profile" (click)="mobileOpen.set(false)" class="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg">Profile</a>
              <button (click)="onLogout()" class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">Log Out</button>
            } @else {
              <a routerLink="/login" (click)="mobileOpen.set(false)" class="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg">Login</a>
              <a routerLink="/register" (click)="mobileOpen.set(false)" class="block px-4 py-2 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-lg">Get Started</a>
            }
          </div>
        }
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  dropdownOpen = signal(false);
  mobileOpen = signal(false);

  constructor(public auth: AuthService, private router: Router) {}

  onLogout(): void {
    this.auth.logout();
    this.dropdownOpen.set(false);
    this.mobileOpen.set(false);
    this.router.navigate(['/']);
  }
}
