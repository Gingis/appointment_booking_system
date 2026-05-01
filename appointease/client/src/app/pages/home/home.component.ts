import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero -->
    <section class="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          School Appointment Booking System
        </div>
        <h1 class="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
          Book Academic<br>
          <span class="text-blue-600">Appointments Online</span>
        </h1>
        <p class="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Schedule consultations, advising sessions, enrollment assistance, and more — all in one convenient platform for students and faculty.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/services" class="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Browse Services
          </a>
          @if (!auth.isLoggedIn()) {
            <a routerLink="/register" class="bg-white text-slate-700 px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-slate-50 border border-slate-200 transition-all">
              Create Account
            </a>
          } @else {
            <a routerLink="/dashboard" class="bg-white text-slate-700 px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-slate-50 border border-slate-200 transition-all">
              My Dashboard
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="bg-white py-12 border-y border-slate-100">
      <div class="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-6 text-center">
        <div>
          <div class="text-3xl font-bold text-blue-600">10+</div>
          <div class="text-slate-500 mt-1 text-sm">Academic Services</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-blue-600">5</div>
          <div class="text-slate-500 mt-1 text-sm">Departments</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-blue-600">Mon–Fri</div>
          <div class="text-slate-500 mt-1 text-sm">Available</div>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="py-16 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold text-slate-900 mb-3">Academic Services</h2>
          <p class="text-slate-500">Choose from a wide range of school appointment services</p>
        </div>
        @if (loading()) {
          <div class="flex justify-center py-12">
            <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (service of services(); track service._id) {
              <div class="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                  </div>
                  <span class="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">{{ service.category }}</span>
                </div>
                <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ service.name }}</h3>
                <p class="text-sm text-slate-500 mb-1">{{ service.department }}</p>
                <p class="text-slate-500 text-sm mb-4 line-clamp-2">{{ service.description }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-400">⏱ {{ service.duration }} min</span>
                  <a [routerLink]="['/book', service._id]" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Book Now
                  </a>
                </div>
              </div>
            }
          </div>
          <div class="text-center mt-10">
            <a routerLink="/services" class="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700">
              View all services
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </a>
          </div>
        }
      </div>
    </section>

    <!-- How it works -->
    <section class="bg-slate-50 py-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-slate-900 mb-12">How It Works</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          @for (step of steps; track step.num) {
            <div class="text-center">
              <div class="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">{{ step.num }}</div>
              <h3 class="font-semibold text-slate-900 mb-2">{{ step.title }}</h3>
              <p class="text-slate-500 text-sm">{{ step.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent implements OnInit {
  services = signal<Service[]>([]);
  loading = signal(true);
  steps = [
    { num: '1', title: 'Choose a Service', desc: 'Browse academic services and select the one you need — consultation, advising, clearance, and more.' },
    { num: '2', title: 'Pick a Schedule', desc: 'Select your preferred date and time slot that fits within school hours.' },
    { num: '3', title: 'Show Up Prepared', desc: 'Receive confirmation and bring any required documents on your appointment day.' },
  ];
  constructor(public auth: AuthService, private serviceService: ServiceService) {}
  ngOnInit(): void {
    this.serviceService.getServices({ limit: 6 }).subscribe({
      next: (res) => { if (res.success && res.data) this.services.set(res.data.services); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
