import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-slate-900 text-slate-400 mt-auto">
      <div class="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <span class="text-white font-bold text-lg">SchoolBook</span>
            </div>
            <p class="text-sm">Book appointments easily. Manage your schedule. All in one place.</p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3">Quick Links</h4>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/services" class="hover:text-white transition-colors">Browse Services</a></li>
              <li><a routerLink="/register" class="hover:text-white transition-colors">Get Started</a></li>
              <li><a routerLink="/login" class="hover:text-white transition-colors">Login</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3">Contact</h4>
            <p class="text-sm">support&#64;appointease.com</p>
            <p class="text-sm mt-1">+63 912 345 6789</p>
          </div>
        </div>
        <div class="border-t border-slate-800 mt-8 pt-6 text-center text-sm">
          <p>&copy; {{ year }} SchoolBook. Built as a Full-Stack Final Project.</p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
}
