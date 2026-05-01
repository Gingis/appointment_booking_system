import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-10">
      <a routerLink="/appointments" class="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-6">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        Back to Appointments
      </a>

      @if (loading()) {
        <div class="flex justify-center py-20"><div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>
      } @else if (appointment()) {
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-blue-200 text-sm mb-1">Appointment #{{ appointment()!._id.slice(-8).toUpperCase() }}</p>
                <h1 class="text-xl font-bold">{{ appointment()!.service?.name }}</h1>
                <p class="text-blue-200 mt-1">{{ appointment()!.service?.department }}</p>
              </div>
              <span class="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/20">{{ appointment()!.status | titlecase }}</span>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-slate-50 rounded-xl p-4">
                <p class="text-xs text-slate-500 mb-1">Date</p>
                <p class="font-semibold text-slate-900">{{ appointment()!.date | date:'EEEE, MMMM d, y' }}</p>
              </div>
              <div class="bg-slate-50 rounded-xl p-4">
                <p class="text-xs text-slate-500 mb-1">Time</p>
                <p class="font-semibold text-slate-900">{{ appointment()!.timeSlot }}</p>
              </div>
              <div class="bg-slate-50 rounded-xl p-4">
                <p class="text-xs text-slate-500 mb-1">Category</p>
                <p class="font-semibold text-slate-900">{{ appointment()!.service?.category }}</p>
              </div>
              <div class="bg-slate-50 rounded-xl p-4">
                <p class="text-xs text-slate-500 mb-1">Duration</p>
                <p class="font-semibold text-slate-900">{{ appointment()!.service?.duration }} minutes</p>
              </div>
            </div>

            @if (appointment()!.purpose) {
              <div>
                <p class="text-sm font-medium text-slate-700 mb-1">Purpose</p>
                <p class="text-slate-600 bg-slate-50 rounded-xl p-3 text-sm">{{ appointment()!.purpose }}</p>
              </div>
            }

            @if (appointment()!.notes) {
              <div>
                <p class="text-sm font-medium text-slate-700 mb-1">Your Notes</p>
                <p class="text-slate-600 bg-slate-50 rounded-xl p-3 text-sm">{{ appointment()!.notes }}</p>
              </div>
            }

            @if (appointment()!.adminNotes) {
              <div class="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p class="text-sm font-semibold text-blue-800 mb-1">Admin / Faculty Notes</p>
                <p class="text-blue-700 text-sm">{{ appointment()!.adminNotes }}</p>
              </div>
            }

            @if (appointment()!.attachments && appointment()!.attachments!.length > 0) {
              <div>
                <p class="text-sm font-medium text-slate-700 mb-2">Attachments</p>
                <div class="space-y-2">
                  @for (url of appointment()!.attachments!; track url) {
                    <a [href]="url" target="_blank" class="flex items-center gap-2 text-blue-600 hover:underline text-sm">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                      View Attachment
                    </a>
                  }
                </div>
              </div>
            }

            <div class="pt-2 border-t border-slate-100">
              <p class="text-xs text-slate-400">Booked on {{ appointment()!.createdAt | date:'MMMM d, y, h:mm a' }}</p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AppointmentDetailComponent implements OnInit {
  appointment = signal<Appointment | null>(null);
  loading = signal(true);

  constructor(private route: ActivatedRoute, private apptService: AppointmentService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.apptService.getById(id).subscribe({
      next: (res) => { if (res.success && res.data) this.appointment.set(res.data.appointment); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
