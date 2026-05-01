import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 to-indigo-50">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-slate-900">Create your account</h1>
            <p class="text-slate-500 mt-1">Join SchoolBook and start booking</p>
          </div>

          @if (error()) {
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{{ error() }}</div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input formControlName="name" type="text" placeholder="Juan Dela Cruz"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                [class.border-red-400]="f['name'].invalid && f['name'].touched">
              @if (f['name'].invalid && f['name'].touched) {
                <p class="text-red-500 text-xs mt-1">Name must be at least 2 characters.</p>
              }
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input formControlName="email" type="email" placeholder="you@example.com"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                [class.border-red-400]="f['email'].invalid && f['email'].touched">
              @if (f['email'].invalid && f['email'].touched) {
                <p class="text-red-500 text-xs mt-1">Please enter a valid email.</p>
              }
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Phone (optional)</label>
              <input formControlName="phone" type="tel" placeholder="+63 912 345 6789"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input formControlName="password" type="password" placeholder="At least 6 characters"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                [class.border-red-400]="f['password'].invalid && f['password'].touched">
              @if (f['password'].invalid && f['password'].touched) {
                <p class="text-red-500 text-xs mt-1">Password must be at least 6 characters.</p>
              }
            </div>

            <button type="submit" [disabled]="loading() || form.invalid"
              class="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
              @if (loading()) {
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              }
              {{ loading() ? 'Creating account...' : 'Create Account' }}
            </button>
          </form>

          <p class="text-center text-slate-500 text-sm mt-6">
            Already have an account? <a routerLink="/login" class="text-indigo-600 font-semibold hover:text-indigo-700">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  form: FormGroup;
  loading = signal(false);
  error = signal('');

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    this.auth.register(this.form.value).subscribe({
      next: (res) => {
        if (res.success) this.router.navigate(['/dashboard']);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Registration failed.');
        this.loading.set(false);
      },
    });
  }
}
