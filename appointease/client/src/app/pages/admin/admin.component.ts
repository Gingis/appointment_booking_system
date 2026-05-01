import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="flex min-h-[calc(100vh-64px)]">
      <!-- Sidebar -->
      <aside class="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden md:flex flex-col">
        <div class="p-5 border-b border-slate-800">
          <p class="text-xs text-slate-500 uppercase tracking-widest mb-1">Administration</p>
          <p class="text-white font-semibold">{{ auth.user()?.name }}</p>
        </div>
        <nav class="flex-1 p-4 space-y-1">
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="bg-slate-800 text-white"
              class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors">
              <span [innerHTML]="item.icon" class="w-5 h-5 flex-shrink-0"></span>
              {{ item.label }}
            </a>
          }
        </nav>
        <div class="p-4 border-t border-slate-800">
          <button (click)="logout()" class="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Logout
          </button>
        </div>
      </aside>
      <!-- Content -->
      <main class="flex-1 bg-slate-50 overflow-auto">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminComponent {
  navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>' },
    { path: '/admin/appointments', label: 'Appointments', icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>' },
    { path: '/admin/services', label: 'Services', icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>' },
    { path: '/admin/users', label: 'Users', icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>' },
  ];

  constructor(public auth: AuthService, private router: Router) {}

  logout(): void { this.auth.logout(); this.router.navigate(['/login']); }
}
