import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-10 sm:px-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900">Welcome, {{ auth.user()?.name }}!</h1>
        <p class="text-slate-500 mt-1">Manage your academic appointments from your dashboard.</p>
      </div>
      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        @for (stat of stats(); track stat.label) {
          <div class="bg-white rounded-2xl border border-slate-200 p-5">
            <div class="text-2xl font-bold" [class]="stat.color">{{ stat.value }}</div>
            <div class="text-sm text-slate-500 mt-1">{{ stat.label }}</div>
          </div>
        }
      </div>
      <!-- Quick actions -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <a routerLink="/services" class="bg-blue-600 text-white rounded-2xl p-5 flex items-center gap-4 hover:bg-blue-700 transition-colors">
          <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          </div>
          <div><div class="font-semibold text-lg">Book Appointment</div><div class="text-blue-200 text-sm">Browse and schedule a service</div></div>
        </a>
        <a routerLink="/appointments" class="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all">
          <div class="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <div><div class="font-semibold text-slate-900 text-lg">My Appointments</div><div class="text-slate-500 text-sm">View appointment history</div></div>
        </a>
      </div>
      <!-- Recent -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="font-bold text-slate-900 text-lg">Recent Appointments</h2>
          <a routerLink="/appointments" class="text-blue-600 text-sm hover:text-blue-700">View all</a>
        </div>
        @if (loading()) {
          <div class="flex justify-center py-8"><div class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>
        } @else if (appointments().length === 0) {
          <div class="text-center py-10"><p class="text-slate-400 text-sm">No appointments yet. <a routerLink="/services" class="text-blue-600 hover:underline">Book your first one!</a></p></div>
        } @else {
          <div class="space-y-3">
            @for (appt of appointments(); track appt._id) {
              <a [routerLink]="['/appointments', appt._id]" class="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors">
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-slate-900 truncate">{{ appt.service?.name }}</div>
                  <div class="text-sm text-slate-500">{{ appt.date | date:'EEE, MMM d, y' }} · {{ appt.timeSlot }}</div>
                  @if (appt.purpose) { <div class="text-xs text-slate-400 mt-0.5 truncate">{{ appt.purpose }}</div> }
                </div>
                <span class="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0" [class]="badge(appt.status)">{{ appt.status | titlecase }}</span>
              </a>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  appointments = signal<Appointment[]>([]);
  loading = signal(true);
  stats = signal<{ label: string; value: number; color: string }[]>([]);
  constructor(public auth: AuthService, private apptService: AppointmentService) {}
  ngOnInit(): void {
    this.apptService.getAppointments({ limit: 5 }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const list = res.data.appointments;
          this.appointments.set(list);
          this.stats.set([
            { label: 'Total', value: res.data.pagination.total, color: 'text-slate-900' },
            { label: 'Pending', value: list.filter(a => a.status === 'pending').length, color: 'text-yellow-600' },
            { label: 'Confirmed', value: list.filter(a => a.status === 'confirmed').length, color: 'text-green-600' },
            { label: 'Completed', value: list.filter(a => a.status === 'completed').length, color: 'text-blue-600' },
          ]);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
  badge(s: string): string {
    const map: Record<string, string> = { pending:'bg-yellow-100 text-yellow-700', confirmed:'bg-green-100 text-green-700', completed:'bg-blue-100 text-blue-700', cancelled:'bg-red-100 text-red-700', rejected:'bg-red-100 text-red-700' };
    return map[s] || 'bg-slate-100 text-slate-700';
  }
}
