import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../../services/appointment.service';
import { AppointmentStats } from '../../../models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6 md:p-8">
      <h1 class="text-2xl font-bold text-slate-900 mb-6">Admin Dashboard</h1>

      @if (loading()) {
        <div class="flex justify-center py-20"><div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>
      } @else {
        <!-- Stats grid -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          @for (card of statCards(); track card.label) {
            <div class="bg-white rounded-2xl border border-slate-200 p-5 text-center">
              <div class="text-3xl font-bold mb-1" [class]="card.color">{{ card.value }}</div>
              <div class="text-xs text-slate-500">{{ card.label }}</div>
            </div>
          }
        </div>

        <!-- Quick links -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a routerLink="/admin/appointments" class="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all">
            <h3 class="font-semibold text-slate-900 mb-1">Manage Appointments</h3>
            <p class="text-sm text-slate-500">Approve, reject, or complete student appointments</p>
          </a>
          <a routerLink="/admin/services" class="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all">
            <h3 class="font-semibold text-slate-900 mb-1">Manage Services</h3>
            <p class="text-sm text-slate-500">Add or update available academic services</p>
          </a>
          <a routerLink="/admin/users" class="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all">
            <h3 class="font-semibold text-slate-900 mb-1">Manage Users</h3>
            <p class="text-sm text-slate-500">View and manage student and staff accounts</p>
          </a>
        </div>
      }
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  loading = signal(true);
  statCards = signal<{ label: string; value: number; color: string }[]>([]);

  constructor(private apptService: AppointmentService) {}

  ngOnInit(): void {
    this.apptService.getStats().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const s: AppointmentStats = res.data.stats;
          this.statCards.set([
            { label: 'Total', value: s.total, color: 'text-slate-900' },
            { label: 'Pending', value: s.pending, color: 'text-yellow-600' },
            { label: 'Confirmed', value: s.confirmed, color: 'text-green-600' },
            { label: 'Completed', value: s.completed, color: 'text-blue-600' },
            { label: 'Cancelled', value: s.cancelled, color: 'text-red-500' },
          ]);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
