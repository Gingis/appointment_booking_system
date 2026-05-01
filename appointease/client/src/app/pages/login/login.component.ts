import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 to-indigo-50">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div class="text-center mb-8">
            <div class="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p class="text-slate-500 mt-1">Sign in to your SchoolBook account</p>
          </div>

          @if (error()) {
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {{ error() }}
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input formControlName="email" type="email" placeholder="you@example.com"
                class="w-full px-4 py-2.5 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                [class.border-red-400]="form.get('email')?.invalid && form.get('email')?.touched"
                [class.border-slate-200]="!(form.get('email')?.invalid && form.get('email')?.touched)">
              @if (form.get('email')?.invalid && form.get('email')?.touched) {
                <p class="text-red-500 text-xs mt-1">Please enter a valid email.</p>
              }
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div class="relative">
                <input formControlName="password" [type]="showPass() ? 'text' : 'password'" placeholder="••••••••"
                  class="w-full px-4 py-2.5 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-12"
                  [class.border-red-400]="form.get('password')?.invalid && form.get('password')?.touched"
                  [class.border-slate-200]="!(form.get('password')?.invalid && form.get('password')?.touched)">
                <button type="button" (click)="showPass.set(!showPass())" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="showPass() ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"/>
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" [disabled]="loading() || form.invalid"
              class="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
              @if (loading()) {
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              }
              {{ loading() ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <p class="text-center text-slate-500 text-sm mt-6">
            Don't have an account? <a routerLink="/register" class="text-indigo-600 font-semibold hover:text-indigo-700">Create one</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  form: FormGroup;
  loading = signal(false);
  error = signal('');
  showPass = signal(false);

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate([this.auth.isAdmin() ? '/admin/dashboard' : '/dashboard']);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Login failed. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
