import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Appointment, ApiResponse, AppointmentStats } from '../models';

interface AppointmentFilters {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

interface AppointmentListResponse {
  appointments: Appointment[];
  pagination: { page: number; limit: number; total: number; pages: number; };
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly API = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getAppointments(filters: AppointmentFilters = {}): Observable<ApiResponse<AppointmentListResponse>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) params = params.set(k, String(v)); });
    return this.http.get<ApiResponse<AppointmentListResponse>>(this.API, { params });
  }

  getById(id: string): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.get<ApiResponse<{ appointment: Appointment }>>(`${this.API}/${id}`);
  }

  create(data: { service: string; date: string; timeSlot: string; notes?: string }): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.post<ApiResponse<{ appointment: Appointment }>>(this.API, data);
  }

  update(id: string, data: Partial<Appointment>): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.put<ApiResponse<{ appointment: Appointment }>>(`${this.API}/${id}`, data);
  }

  cancel(id: string): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.patch<ApiResponse<{ appointment: Appointment }>>(`${this.API}/${id}/cancel`, {});
  }

  getStats(): Observable<ApiResponse<{ stats: AppointmentStats }>> {
    return this.http.get<ApiResponse<{ stats: AppointmentStats }>>(`${this.API}/stats`);
  }
}
