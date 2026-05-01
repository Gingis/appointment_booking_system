import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ServiceService } from '../../services/service.service';
import { AuthService } from '../../services/auth.service';
import { Service } from '../../models';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-10">
      <div class="mb-8 text-center">
        <span class="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">Academic Services</span>
        <h1 class="text-4xl font-extrabold text-slate-900 mb-2">Book an Appointment</h1>
        <p class="text-slate-500 max-w-xl mx-auto">Schedule consultations with professors, guidance counselors, registrar, and other academic offices.</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 mb-8">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input [(ngModel)]="search" (ngModelChange)="onSearch($event)" type="text" placeholder="Search services..."
            class="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
        </div>
        <select [(ngModel)]="selectedCategory" (ngModelChange)="onCategoryChange($event)"
          class="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white min-w-[180px]">
          <option value="">All Departments</option>
          @for (cat of categories(); track cat) {
            <option [value]="cat">{{ cat }}</option>
          }
        </select>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-16">
          <div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      } @else if (services().length === 0) {
        <div class="text-center py-16">
          <p class="text-slate-400 text-lg">No services found for your search.</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (service of services(); track service._id) {
            <div class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
              <div class="w-full h-36 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-t-2xl flex items-center justify-center">
                <svg class="w-12 h-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <div class="p-5 flex flex-col flex-1">
                <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit mb-2">{{ service.category }}</span>
                <h3 class="text-lg font-bold text-slate-900 mb-1">{{ service.name }}</h3>
                <p class="text-slate-500 text-sm flex-1 mb-4 line-clamp-2">{{ service.description }}</p>
                <div class="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <span class="text-xl font-bold text-slate-900">₱{{ service.price }}</span>
                    <span class="text-slate-400 text-xs ml-1">· {{ service.duration }}min</span>
                  </div>
                  @if (auth.isLoggedIn()) {
                    <a [routerLink]="['/book', service._id]" class="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">Book</a>
                  } @else {
                    <a routerLink="/login" class="bg-slate-100 text-slate-600 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors">Login to Book</a>
                  }
                </div>
              </div>
            </div>
          }
        </div>
        @if (totalPages() > 1) {
          <div class="flex justify-center gap-2 mt-10">
            <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 1" class="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50 transition">Previous</button>
            @for (p of pageArray(); track p) {
              <button (click)="changePage(p)" class="w-10 h-10 rounded-xl text-sm font-medium transition" [class]="currentPage() === p ? 'bg-blue-600 text-white' : 'border border-slate-200 hover:bg-slate-50'">{{ p }}</button>
            }
            <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() === totalPages()" class="px-4 py-2 rounded-xl border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50 transition">Next</button>
          </div>
        }
      }
    </div>
  `,
})
export class ServicesComponent implements OnInit {
  services = signal<Service[]>([]);
  categories = signal<string[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  totalPages = signal(1);
  search = '';
  selectedCategory = '';
  private searchSubject = new Subject<string>();

  constructor(private svc: ServiceService, public auth: AuthService) {}

  ngOnInit(): void {
    this.loadServices();
    this.loadCategories();
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
      this.currentPage.set(1);
      this.loadServices();
    });
  }

  onSearch(val: string): void { this.search = val; this.searchSubject.next(val); }
  onCategoryChange(val: string): void { this.selectedCategory = val; this.currentPage.set(1); this.loadServices(); }

  loadServices(): void {
    this.loading.set(true);
    this.svc.getServices({ page: this.currentPage(), limit: 9, search: this.search || undefined, category: this.selectedCategory || undefined }).subscribe({
      next: (res) => { if (res.success && res.data) { this.services.set(res.data.services); this.totalPages.set(res.data.pagination.pages); } this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  loadCategories(): void {
    this.svc.getCategories().subscribe(res => { if (res.success && res.data) this.categories.set(res.data.categories); });
  }

  changePage(p: number): void { this.currentPage.set(p); this.loadServices(); }
  pageArray(): number[] { return Array.from({ length: this.totalPages() }, (_, i) => i + 1); }
}
