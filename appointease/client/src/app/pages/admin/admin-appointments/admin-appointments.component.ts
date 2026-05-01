import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment, AppointmentStatus } from '../../../models';

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 md:p-8">
      <h1 class="text-2xl font-bold text-slate-900 mb-6">All Appointments</h1>

      <!-- Filters -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3">
        <select [(ngModel)]="selectedStatus" (ngModelChange)="onFilter()" class="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="rejected">Rejected</option>
        </select>
        <input [(ngModel)]="startDate" (ngModelChange)="onFilter()" type="date" class="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <input [(ngModel)]="endDate" (ngModelChange)="onFilter()" type="date" class="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>

      @if (loading()) {
        <div class="flex justify-center py-20"><div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>
      } @else {
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="text-left px-5 py-3 font-semibold text-slate-600">Student</th>
                  <th class="text-left px-5 py-3 font-semibold text-slate-600">Service</th>
                  <th class="text-left px-5 py-3 font-semibold text-slate-600">Date & Time</th>
                  <th class="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
                  <th class="text-left px-5 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (appt of appointments(); track appt._id) {
                  <tr class="hover:bg-slate-50">
                    <td class="px-5 py-4">
                      <div class="font-medium text-slate-900">{{ appt.user?.name }}</div>
                      <div class="text-xs text-slate-400">{{ appt.user?.email }}</div>
                      @if (appt.user?.studentId) { <div class="text-xs text-slate-400">ID: {{ appt.user?.studentId }}</div> }
                    </td>
                    <td class="px-5 py-4">
                      <div class="font-medium text-slate-900">{{ appt.service?.name }}</div>
                      <div class="text-xs text-slate-400">{{ appt.service?.department }}</div>
                    </td>
                    <td class="px-5 py-4">
                      <div class="text-slate-700">{{ appt.date | date:'MMM d, y' }}</div>
                      <div class="text-slate-400 text-xs">{{ appt.timeSlot }}</div>
                    </td>
                    <td class="px-5 py-4">
                      <span class="text-xs font-medium px-2.5 py-1 rounded-full" [class]="badge(appt.status)">{{ appt.status | titlecase }}</span>
                    </td>
                    <td class="px-5 py-4">
                      <div class="flex gap-2 flex-wrap">
                        @if (appt.status === 'pending') {
                          <button (click)="updateStatus(appt._id, 'confirmed')" class="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors">Confirm</button>
                          <button (click)="updateStatus(appt._id, 'rejected')" class="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors">Reject</button>
                        }
                        @if (appt.status === 'confirmed') {
                          <button (click)="updateStatus(appt._id, 'completed')" class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors">Complete</button>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
            @if (appointments().length === 0) {
              <div class="py-16 text-center text-slate-400">No appointments found.</div>
            }
          </div>
        </div>
        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="flex justify-center gap-2 mt-6">
            <button (click)="goToPage(currentPage()-1)" [disabled]="currentPage()===1" class="px-4 py-2 rounded-lg border border-slate-200 text-sm disabled:opacity-40">Prev</button>
            <span class="px-4 py-2 text-sm text-slate-500">{{ currentPage() }} / {{ totalPages() }}</span>
            <button (click)="goToPage(currentPage()+1)" [disabled]="currentPage()===totalPages()" class="px-4 py-2 rounded-lg border border-slate-200 text-sm disabled:opacity-40">Next</button>
          </div>
        }
      }
    </div>
  `,
})
export class AdminAppointmentsComponent implements OnInit {
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
    const f: any = { page: this.currentPage(), limit: 15 };
    if (this.selectedStatus) f.status = this.selectedStatus;
    if (this.startDate) f.startDate = this.startDate;
    if (this.endDate) f.endDate = this.endDate;
    this.apptService.getAppointments(f).subscribe({
      next: (res) => {
        if (res.success && res.data) { this.appointments.set(res.data.appointments); this.totalPages.set(res.data.pagination.pages); }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFilter(): void { this.currentPage.set(1); this.load(); }
  goToPage(p: number): void { if (p >= 1 && p <= this.totalPages()) { this.currentPage.set(p); this.load(); } }

  updateStatus(id: string, status: AppointmentStatus): void {
    this.apptService.update(id, { status } as any).subscribe({ next: () => this.load() });
  }

  badge(s: string): string {
    const m: Record<string, string> = { pending:'bg-yellow-100 text-yellow-700', confirmed:'bg-green-100 text-green-700', completed:'bg-blue-100 text-blue-700', cancelled:'bg-red-100 text-red-700', rejected:'bg-red-100 text-red-700' };
    return m[s] || 'bg-slate-100 text-slate-700';
  }
}
