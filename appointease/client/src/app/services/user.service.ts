import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API = `${environment.apiUrl}/users`;
  private readonly UPLOAD_API = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  getUsers(filters: { page?: number; limit?: number; search?: string; role?: string } = {}): Observable<ApiResponse<{ users: User[]; pagination: any }>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) params = params.set(k, String(v)); });
    return this.http.get<ApiResponse<{ users: User[]; pagination: any }>>(this.API, { params });
  }

  // ── NEW: update user profile fields ──
  update(id: string, data: { name?: string; email?: string; phone?: string; studentId?: string; yearLevel?: string; course?: string }): Observable<ApiResponse<{ user: User }>> {
    return this.http.put<ApiResponse<{ user: User }>>(`${this.API}/${id}`, data);
  }

  updateRole(id: string, role: 'admin' | 'user'): Observable<ApiResponse<{ user: User }>> {
    return this.http.put<ApiResponse<{ user: User }>>(`${this.API}/${id}/role`, { role });
  }

  toggleStatus(id: string): Observable<ApiResponse<{ user: User }>> {
    return this.http.patch<ApiResponse<{ user: User }>>(`${this.API}/${id}/toggle-status`, {});
  }

  delete(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API}/${id}`);
  }

  uploadAvatar(file: File): Observable<ApiResponse<{ url: string; user: User }>> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<ApiResponse<{ url: string; user: User }>>(`${this.UPLOAD_API}/avatar`, formData);
  }

  uploadAppointmentFile(appointmentId: string, file: File): Observable<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<{ url: string }>>(`${this.UPLOAD_API}/appointment/${appointmentId}`, formData);
  }

  uploadServiceImage(file: File): Observable<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<ApiResponse<{ url: string }>>(`${this.UPLOAD_API}/service`, formData);
  }
}