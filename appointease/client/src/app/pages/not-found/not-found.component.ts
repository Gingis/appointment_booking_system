import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-[calc(100vh-128px)] flex items-center justify-center px-4">
      <div class="text-center">
        <div class="text-8xl font-black text-blue-100 mb-4">404</div>
        <h1 class="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p class="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
        <a routerLink="/" class="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">Go Home</a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
