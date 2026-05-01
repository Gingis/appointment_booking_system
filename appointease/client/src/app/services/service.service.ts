import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Service, ApiResponse } from '../models';

interface ServiceFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

interface ServiceListResponse {
  services: Service[];
  pagination: { page: number; limit: number; total: number; pages: number; };
}

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private readonly API = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  getServices(filters: ServiceFilters = {}): Observable<ApiResponse<ServiceListResponse>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) params = params.set(k, String(v)); });
    return this.http.get<ApiResponse<ServiceListResponse>>(this.API, { params });
  }

  getById(id: string): Observable<ApiResponse<{ service: Service }>> {
    return this.http.get<ApiResponse<{ service: Service }>>(`${this.API}/${id}`);
  }

  getCategories(): Observable<ApiResponse<{ categories: string[] }>> {
    return this.http.get<ApiResponse<{ categories: string[] }>>(`${this.API}/categories`);
  }

  create(data: Partial<Service>): Observable<ApiResponse<{ service: Service }>> {
    return this.http.post<ApiResponse<{ service: Service }>>(this.API, data);
  }

  update(id: string, data: Partial<Service>): Observable<ApiResponse<{ service: Service }>> {
    return this.http.put<ApiResponse<{ service: Service }>>(`${this.API}/${id}`, data);
  }

  delete(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API}/${id}`);
  }
}
