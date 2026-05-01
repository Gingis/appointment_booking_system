import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ServiceService } from '../../services/service.service';
import { AppointmentService } from '../../services/appointment.service';
import { Service } from '../../models';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-10">
      <a routerLink="/services" class="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-6">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        Back to Services
      </a>

      @if (loadingService()) {
        <div class="flex justify-center py-16"><div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>
      } @else if (service()) {
        <!-- Service Info -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-6">
          <span class="text-blue-200 text-xs font-semibold">{{ service()!.category }}</span>
          <h1 class="text-2xl font-bold mt-1">{{ service()!.name }}</h1>
          <p class="text-blue-100 text-sm mt-1 mb-3">{{ service()!.description }}</p>
          <div class="flex gap-4 text-sm">
            <span class="bg-white/20 px-3 py-1 rounded-full">₱{{ service()!.price }}</span>
            <span class="bg-white/20 px-3 py-1 rounded-full">{{ service()!.duration }} minutes</span>
          </div>
        </div>

        <!-- Booking Form -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 class="text-lg font-bold text-slate-900 mb-5">Select Date & Time</h2>

          @if (success()) {
            <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-xl mb-4 text-center">
              <div class="text-2xl mb-1">✅</div>
              <div class="font-semibold">Appointment Booked!</div>
              <div class="text-sm mt-1">Your appointment has been submitted for confirmation.</div>
              <a routerLink="/appointments" class="inline-block mt-3 text-green-700 underline text-sm">View my appointments →</a>
            </div>
          }

          @if (error()) {
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{{ error() }}</div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Date <span class="text-red-500">*</span></label>
              <input formControlName="date" type="date" [min]="minDate"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                [class.border-red-400]="f['date'].invalid && f['date'].touched">
              @if (f['date'].invalid && f['date'].touched) {
                <p class="text-red-500 text-xs mt-1">Please select a date.</p>
              }
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Time Slot <span class="text-red-500">*</span></label>
              <div class="grid grid-cols-4 gap-2">
                @for (slot of timeSlots; track slot) {
                  <button type="button" (click)="selectTimeSlot(slot)"
                    class="py-2 rounded-xl text-sm font-medium border transition-all"
                    [class]="form.value.timeSlot === slot ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-700 hover:border-blue-400'">
                    {{ slot }}
                  </button>
                }
              </div>
              @if (f['timeSlot'].invalid && f['timeSlot'].touched) {
                <p class="text-red-500 text-xs mt-1">Please select a time slot.</p>
              }
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Notes / Purpose (optional)</label>
              <textarea formControlName="notes" rows="3" placeholder="e.g. Subject: MATH101 grade inquiry..."
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"></textarea>
            </div>

            <button type="submit" [disabled]="loading() || form.invalid || success()"
              class="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
              @if (loading()) { <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> }
              {{ loading() ? 'Booking...' : 'Confirm Appointment' }}
            </button>
          </form>
        </div>
      }
    </div>
  `,
})
export class BookingComponent implements OnInit {
  service = signal<Service | null>(null);
  loadingService = signal(true);
  loading = signal(false);
  error = signal('');
  success = signal(false);
  form: FormGroup;
  minDate = new Date().toISOString().split('T')[0];

  timeSlots = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
    '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private svcService: ServiceService,
    private apptService: AppointmentService,
  ) {
    this.form = this.fb.group({
      date: ['', Validators.required],
      timeSlot: ['', Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('serviceId')!;
    this.svcService.getById(id).subscribe({
      next: (res) => { if (res.success && res.data) this.service.set(res.data.service); this.loadingService.set(false); },
      error: () => { this.loadingService.set(false); this.router.navigate(['/services']); },
    });
  }

  get f() { return this.form.controls; }

  selectTimeSlot(slot: string): void { this.form.patchValue({ timeSlot: slot }); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');
    this.apptService.create({ service: this.service()!._id, ...this.form.value }).subscribe({
      next: (res) => { if (res.success) this.success.set(true); this.loading.set(false); },
      error: (err) => { this.error.set(err.error?.message || 'Booking failed. Please try again.'); this.loading.set(false); },
    });
  }
}
