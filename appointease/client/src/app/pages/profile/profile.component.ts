import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-10">
      <h1 class="text-2xl font-bold text-slate-900 mb-8">My Profile</h1>

      <!-- Avatar -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <h2 class="font-semibold text-slate-800 mb-4">Profile Photo</h2>
        <div class="flex items-center gap-5">
          <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            @if (avatarPreview()) {
              <img [src]="avatarPreview()" class="w-full h-full object-cover" alt="avatar">
            } @else if (auth.user()?.avatar) {
              <img [src]="auth.user()!.avatar" class="w-full h-full object-cover" alt="avatar">
            } @else {
              <span class="text-blue-700 text-2xl font-bold">{{ auth.user()?.name?.charAt(0)?.toUpperCase() }}</span>
            }
          </div>
          <div>
            <input type="file" #fileInput (change)="onFileChange($event)" accept="image/*" class="hidden">
            <button (click)="fileInput.click()" [disabled]="uploading()"
              class="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {{ uploading() ? 'Uploading...' : 'Upload Photo' }}
            </button>
            @if (avatarError()) {
              <p class="text-xs text-red-500 mt-1">{{ avatarError() }}</p>
            } @else {
              <p class="text-xs text-slate-400 mt-1">JPG or PNG, max 5MB</p>
            }
            @if (avatarSuccess()) {
              <p class="text-xs text-green-600 mt-1">Photo updated successfully!</p>
            }
          </div>
        </div>
      </div>

      <!-- Profile form -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <h2 class="font-semibold text-slate-800 mb-4">Personal Information</h2>
        @if (profileSuccess()) {
          <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-xl text-sm mb-4">Profile updated successfully!</div>
        }
        @if (profileError()) {
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm mb-4">{{ profileError() }}</div>
        }
        <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input formControlName="name" type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
              <input formControlName="phone" type="tel" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Student ID</label>
              <input formControlName="studentId" type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Course / Program</label>
              <input formControlName="course" type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Year Level</label>
              <select formControlName="yearLevel" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select year level</option>
                <option>1st Year</option><option>2nd Year</option><option>3rd Year</option>
                <option>4th Year</option><option>5th Year</option><option>Graduate</option>
                <option>Faculty</option><option>Staff</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input [value]="auth.user()?.email" type="email" disabled
                class="w-full px-4 py-2.5 border border-slate-100 bg-slate-50 rounded-xl text-slate-400 cursor-not-allowed">
            </div>
          </div>
          <button type="submit" [disabled]="savingProfile()"
            class="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors">
            {{ savingProfile() ? 'Saving...' : 'Save Changes' }}
          </button>
        </form>
      </div>

      <!-- Change password -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 class="font-semibold text-slate-800 mb-4">Change Password</h2>
        @if (pwSuccess()) {
          <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-xl text-sm mb-4">Password changed successfully!</div>
        }
        @if (pwError()) {
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm mb-4">{{ pwError() }}</div>
        }
        <form [formGroup]="pwForm" (ngSubmit)="onChangePassword()">
          <div class="space-y-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
              <input formControlName="currentPassword" type="password"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <input formControlName="newPassword" type="password"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
          <button type="submit" [disabled]="savingPw()"
            class="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-900 disabled:opacity-60 transition-colors">
            {{ savingPw() ? 'Updating...' : 'Update Password' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  pwForm: FormGroup;
  uploading = signal(false);
  savingProfile = signal(false);
  savingPw = signal(false);
  profileSuccess = signal(false);
  profileError = signal('');
  pwSuccess = signal(false);
  pwError = signal('');
  avatarPreview = signal<string | null>(null);
  avatarError = signal('');
  avatarSuccess = signal(false);

  constructor(public auth: AuthService, private userService: UserService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: [''],
      studentId: [''],
      course: [''],
      yearLevel: [''],
    });
    this.pwForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    const u = this.auth.user();
    if (u) this.profileForm.patchValue({
      name: u.name,
      phone: u.phone || '',
      studentId: u.studentId || '',
      course: u.course || '',
      yearLevel: u.yearLevel || ''
    });
  }

  onFileChange(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      this.avatarError.set('File is too large. Max 5MB.');
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = () => this.avatarPreview.set(reader.result as string);
    reader.readAsDataURL(file);

    this.uploading.set(true);
    this.avatarError.set('');
    this.avatarSuccess.set(false);

    this.userService.uploadAvatar(file).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          // Update the auth user signal so avatar appears everywhere
          const currentUser = this.auth.user();
          if (currentUser) {
            (this.auth as any)._user.set({ ...currentUser, avatar: res.data.url });
            localStorage.setItem('sb_user', JSON.stringify({ ...currentUser, avatar: res.data.url }));
          }
          this.avatarSuccess.set(true);
        }
        this.uploading.set(false);
      },
      error: () => {
        this.avatarError.set('Upload failed. Please try again.');
        this.avatarPreview.set(null);
        this.uploading.set(false);
      },
    });
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid) return;
    this.savingProfile.set(true);
    this.profileSuccess.set(false);
    this.profileError.set('');
    this.auth.updateProfile(this.profileForm.value).subscribe({
      next: () => { this.profileSuccess.set(true); this.savingProfile.set(false); },
      error: (err) => { this.profileError.set(err.error?.message || 'Update failed.'); this.savingProfile.set(false); },
    });
  }

  onChangePassword(): void {
    if (this.pwForm.invalid) return;
    this.savingPw.set(true);
    this.pwSuccess.set(false);
    this.pwError.set('');
    const { currentPassword, newPassword } = this.pwForm.value;
    this.auth.changePassword(currentPassword, newPassword).subscribe({
      next: () => { this.pwSuccess.set(true); this.pwForm.reset(); this.savingPw.set(false); },
      error: (err) => { this.pwError.set(err.error?.message || 'Password change failed.'); this.savingPw.set(false); },
    });
  }
}