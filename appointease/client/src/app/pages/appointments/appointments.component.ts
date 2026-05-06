import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment, AppointmentStatus } from '../../models';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-10 sm:px-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-slate-900">My Appointments</h1>
        <a routerLink="/services" class="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">+ Book New</a>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row gap-3 items-end">
        <div class="flex-1 flex flex-col gap-1">
          <label class="text-xs text-slate-500 font-medium px-1">Status</label>
          <select [(ngModel)]="selectedStatus" (ngModelChange)="onFilter()" class="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div class="flex-1 flex flex-col gap-1">
          <label class="text-xs text-slate-500 font-medium px-1">From</label>
          <input [(ngModel)]="startDate" (ngModelChange)="onFilter()" type="date"
            class="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="flex-1 flex flex-col gap-1">
          <label class="text-xs text-slate-500 font-medium px-1">To</label>
          <input [(ngModel)]="endDate" (ngModelChange)="onFilter()" type="date"
            class="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-20"><div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>
      } @else if (appointments().length === 0) {
        <div class="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
          <p class="text-slate-500 mb-4">No appointments found.</p>
          <a routerLink="/services" class="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700">Book an Appointment</a>
        </div>
      } @else {
        <div class="space-y-3">
          @for (appt of appointments(); track appt._id) {
            <div class="bg-white rounded-2xl border border-slate-200 p-5">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="font-semibold text-slate-900">{{ appt.service?.name }}</h3>
                    <span class="text-xs font-medium px-2 py-0.5 rounded-full" [class]="badge(appt.status)">{{ appt.status | titlecase }}</span>
                  </div>
                  <p class="text-sm text-blue-600 mt-0.5">{{ appt.service?.department }}</p>
                  <div class="flex gap-4 mt-2 text-sm text-slate-500">
                    <span>📅 {{ appt.date | date:'EEE, MMMM d, y' }}</span>
                    <span>🕐 {{ appt.timeSlot }}</span>
                  </div>
                  @if (appt.purpose) { <p class="text-sm text-slate-500 mt-1">Purpose: {{ appt.purpose }}</p> }
                  @if (appt.adminNotes) {
                    <div class="mt-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-sm text-blue-700">
                      <span class="font-medium">Admin note:</span> {{ appt.adminNotes }}
                    </div>
                  }
                </div>
                <div class="flex flex-col gap-2 flex-shrink-0">
                  <a [routerLink]="['/appointments', appt._id]" class="text-sm text-blue-600 hover:underline">View</a>
                  @if (canCancel(appt.status)) {
                    <button (click)="cancelAppt(appt._id)" class="text-sm text-red-500 hover:underline">Cancel</button>
                  }
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="flex justify-center gap-2 mt-8">
            <button (click)="goToPage(currentPage() - 1)" [disabled]="currentPage() === 1" class="px-4 py-2 rounded-lg border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50">Prev</button>
            <span class="px-4 py-2 text-sm text-slate-600">Page {{ currentPage() }} of {{ totalPages() }}</span>
            <button (click)="goToPage(currentPage() + 1)" [disabled]="currentPage() === totalPages()" class="px-4 py-2 rounded-lg border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50">Next</button>
          </div>
        }
      }
    </div>
  `,
})
export class AppointmentsComponent implements OnInit {
  appointments = signal<Appointment[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  totalPages = signal(1);
  selectedStatus = '';
  startDate = '';
  endDate = '';

  constructor(private apptService: AppointmentService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    const filters: any = { page: this.currentPage(), limit: 10 };
    if (this.selectedStatus) filters.status = this.selectedStatus;
    if (this.startDate) filters.startDate = this.startDate;
    if (this.endDate) filters.endDate = this.endDate;
    this.apptService.getAppointments(filters).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.appointments.set(res.data.appointments);
          this.totalPages.set(res.data.pagination.pages);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFilter(): void { this.currentPage.set(1); this.load(); }
  goToPage(p: number): void { if (p >= 1 && p <= this.totalPages()) { this.currentPage.set(p); this.load(); } }
  canCancel(s: AppointmentStatus): boolean { return ['pending', 'confirmed'].includes(s); }

  cancelAppt(id: string): void {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    this.apptService.cancel(id).subscribe({ next: () => this.load() });
  }

  badge(s: string): string {
    const m: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return m[s] || 'bg-slate-100 text-slate-700';
  }
}