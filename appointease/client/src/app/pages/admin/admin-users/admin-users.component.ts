import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 md:p-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-slate-900">Users</h1>
        <span class="text-sm text-slate-500">{{ total() }} total accounts</span>
      </div>

      <!-- Search & Filter -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input [(ngModel)]="search" (ngModelChange)="onSearch($event)" type="text" placeholder="Search by name or email..."
            class="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <select [(ngModel)]="roleFilter" (ngModelChange)="onRoleFilter($event)"
          class="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">All Roles</option>
          <option value="user">Students / Users</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-20">
          <div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      } @else {
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="text-left px-5 py-3 font-semibold text-slate-600">User</th>
                  <th class="text-left px-5 py-3 font-semibold text-slate-600">Contact</th>
                  <th class="text-left px-5 py-3 font-semibold text-slate-600">Role</th>
                  <th class="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
                  <th class="text-left px-5 py-3 font-semibold text-slate-600">Joined</th>
                  <th class="text-left px-5 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (user of users(); track user._id) {
                  <tr class="hover:bg-slate-50">
                    <td class="px-5 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          @if (user.avatar) {
                            <img [src]="user.avatar" class="w-9 h-9 rounded-full object-cover" alt="">
                          } @else {
                            <span class="text-blue-700 font-semibold text-sm">{{ user.name.charAt(0).toUpperCase() }}</span>
                          }
                        </div>
                        <div>
                          <div class="font-medium text-slate-900">{{ user.name }}</div>
                          <div class="text-xs text-slate-400">ID: {{ user._id.slice(-6).toUpperCase() }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-5 py-4">
                      <div class="text-slate-700">{{ user.email }}</div>
                      @if (user.phone) { <div class="text-xs text-slate-400">{{ user.phone }}</div> }
                    </td>
                    <td class="px-5 py-4">
                      <span class="text-xs font-semibold px-2.5 py-1 rounded-full"
                        [class]="user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'">
                        {{ user.role | titlecase }}
                      </span>
                    </td>
                    <td class="px-5 py-4">
                      <span class="text-xs font-medium px-2.5 py-1 rounded-full"
                        [class]="user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'">
                        {{ user.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td class="px-5 py-4 text-slate-500 text-xs">
                      {{ user.createdAt | date:'MMM d, y' }}
                    </td>
                    <td class="px-5 py-4">
                      <div class="flex gap-1 flex-wrap">
                        <button (click)="toggleRole(user)"
                          class="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors">
                          Make {{ user.role === 'admin' ? 'User' : 'Admin' }}
                        </button>
                        <button (click)="toggleStatus(user)"
                          class="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
                          [class]="user.isActive ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'">
                          {{ user.isActive ? 'Deactivate' : 'Activate' }}
                        </button>
                        <button (click)="deleteUser(user._id)"
                          class="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
            @if (users().length === 0) {
              <div class="py-16 text-center text-slate-400">No users found.</div>
            }
          </div>
        </div>

        @if (totalPages() > 1) {
          <div class="flex justify-center gap-2 mt-6">
            <button (click)="goToPage(currentPage()-1)" [disabled]="currentPage()===1"
              class="px-4 py-2 rounded-lg border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50">Prev</button>
            <span class="px-4 py-2 text-sm text-slate-500">{{ currentPage() }} / {{ totalPages() }}</span>
            <button (click)="goToPage(currentPage()+1)" [disabled]="currentPage()===totalPages()"
              class="px-4 py-2 rounded-lg border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50">Next</button>
          </div>
        }
      }
    </div>
  `,
})
export class AdminUsersComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  totalPages = signal(1);
  total = signal(0);
  search = '';
  roleFilter = '';
  private searchSubject = new Subject<string>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.load();
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
      this.currentPage.set(1); this.load();
    });
  }

  onSearch(val: string): void { this.search = val; this.searchSubject.next(val); }
  onRoleFilter(val: string): void { this.roleFilter = val; this.currentPage.set(1); this.load(); }

  load(): void {
    this.loading.set(true);
    const filters: Record<string, unknown> = { page: this.currentPage(), limit: 15 };
    if (this.search) filters['search'] = this.search;
    if (this.roleFilter) filters['role'] = this.roleFilter;
    this.userService.getUsers(filters as any).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.users.set(res.data.users);
          this.totalPages.set(res.data.pagination.pages);
          this.total.set(res.data.pagination.total);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  goToPage(p: number): void { if (p >= 1 && p <= this.totalPages()) { this.currentPage.set(p); this.load(); } }

  toggleRole(user: User): void {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return;
    this.userService.updateRole(user._id, newRole).subscribe({ next: () => this.load() });
  }

  toggleStatus(user: User): void {
    if (!confirm(`${user.isActive ? 'Deactivate' : 'Activate'} ${user.name}?`)) return;
    this.userService.toggleStatus(user._id).subscribe({ next: () => this.load() });
  }

  deleteUser(id: string): void {
    if (!confirm('Permanently delete this user? This cannot be undone.')) return;
    this.userService.delete(id).subscribe({ next: () => this.load() });
  }
}
