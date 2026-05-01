import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ServiceService } from '../../../services/service.service';
import { UserService } from '../../../services/user.service';
import { Service } from '../../../models';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-6 md:p-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-slate-900">Academic Services</h1>
        <button (click)="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
          + Add Service
        </button>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-20">
          <div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          @for (svc of services(); track svc._id) {
            <div class="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{{ svc.category }}</span>
                  <h3 class="font-bold text-slate-900 mt-2">{{ svc.name }}</h3>
                  <p class="text-sm text-slate-500 mt-0.5 line-clamp-2">{{ svc.description }}</p>
                </div>
                <span class="shrink-0 text-xs px-2 py-1 rounded-full font-medium" [class]="svc.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'">
                  {{ svc.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="flex gap-3 text-sm text-slate-600 pt-2 border-t border-slate-100">
                <span class="font-semibold text-slate-900">₱{{ svc.price }}</span>
                <span class="text-slate-400">·</span>
                <span>{{ svc.duration }} min</span>
              </div>
              <div class="flex gap-2">
                <button (click)="editService(svc)" class="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Edit</button>
                <button (click)="deleteService(svc._id)" class="flex-1 py-2 rounded-xl border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">Deactivate</button>
              </div>
            </div>
          }
        </div>
        @if (services().length === 0) {
          <div class="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400">
            No services yet. Click "Add Service" to create one.
          </div>
        }
      }

      <!-- Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div class="flex items-center justify-between mb-5">
              <h2 class="text-lg font-bold text-slate-900">{{ editMode() ? 'Edit Service' : 'New Service' }}</h2>
              <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            @if (formError()) {
              <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{{ formError() }}</div>
            }

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Service Name *</label>
                <input formControlName="name" type="text" placeholder="e.g. Grade Consultation"
                  class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-400]="f['name'].invalid && f['name'].touched">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Department / Category *</label>
                <input formControlName="category" type="text" placeholder="e.g. Registrar, Guidance, College of Engineering"
                  class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-400]="f['category'].invalid && f['category'].touched">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                <textarea formControlName="description" rows="3" placeholder="Brief description of this service..."
                  class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  [class.border-red-400]="f['description'].invalid && f['description'].touched"></textarea>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Duration (minutes) *</label>
                  <input formControlName="duration" type="number" min="5" placeholder="30"
                    class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    [class.border-red-400]="f['duration'].invalid && f['duration'].touched">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Fee (₱) *</label>
                  <input formControlName="price" type="number" min="0" placeholder="0"
                    class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    [class.border-red-400]="f['price'].invalid && f['price'].touched">
                </div>
              </div>

              <!-- Image upload -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Service Image (optional)</label>
                <input type="file" accept="image/*" (change)="onFileChange($event)"
                  class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100">
                @if (uploadingImage()) {
                  <p class="text-xs text-blue-600 mt-1">Uploading image...</p>
                }
              </div>

              <div class="flex gap-3 pt-2">
                <button type="button" (click)="closeModal()" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" [disabled]="submitting() || form.invalid"
                  class="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
                  @if (submitting()) { <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> }
                  {{ editMode() ? 'Save Changes' : 'Create Service' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminServicesComponent implements OnInit {
  services = signal<Service[]>([]);
  loading = signal(true);
  showModal = signal(false);
  editMode = signal(false);
  submitting = signal(false);
  formError = signal('');
  uploadingImage = signal(false);
  editId = signal('');
  uploadedImageUrl = signal('');
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private svcService: ServiceService,
    private userService: UserService,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      duration: [30, [Validators.required, Validators.min(5)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  get f() { return this.form.controls; }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.svcService.getServices({ limit: 100 }).subscribe({
      next: (res) => { if (res.success && res.data) this.services.set(res.data.services); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openModal(): void {
    this.editMode.set(false);
    this.editId.set('');
    this.uploadedImageUrl.set('');
    this.form.reset({ duration: 30, price: 0 });
    this.formError.set('');
    this.showModal.set(true);
  }

  editService(svc: Service): void {
    this.editMode.set(true);
    this.editId.set(svc._id);
    this.form.patchValue({ name: svc.name, category: svc.category, description: svc.description, duration: svc.duration, price: svc.price });
    this.uploadedImageUrl.set(svc.image || '');
    this.formError.set('');
    this.showModal.set(true);
  }

  closeModal(): void { this.showModal.set(false); }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploadingImage.set(true);
    this.userService.uploadServiceImage(file).subscribe({
      next: (res) => { if (res.success && res.data) this.uploadedImageUrl.set(res.data.url); this.uploadingImage.set(false); },
      error: () => this.uploadingImage.set(false),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.formError.set('');
    const payload = { ...this.form.value, ...(this.uploadedImageUrl() ? { image: this.uploadedImageUrl() } : {}) };
    const req = this.editMode()
      ? this.svcService.update(this.editId(), payload)
      : this.svcService.create(payload);
    req.subscribe({
      next: (res) => { if (res.success) { this.closeModal(); this.load(); } this.submitting.set(false); },
      error: (err) => { this.formError.set(err.error?.message || 'Failed to save service.'); this.submitting.set(false); },
    });
  }

  deleteService(id: string): void {
    if (!confirm('Deactivate this service?')) return;
    this.svcService.delete(id).subscribe({ next: () => this.load() });
  }
}
