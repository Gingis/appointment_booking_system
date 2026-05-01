import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, ApiResponse, AuthResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'sb_token';
  private readonly USER_KEY = 'sb_user';

  private _user = signal<User | null>(this.loadUser());
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._user());
  readonly isAdmin = computed(() => this._user()?.role === 'admin');

  constructor(private http: HttpClient) {}

  register(data: { name: string; email: string; password: string; phone?: string }): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API}/register`, data).pipe(
      tap((res) => { if (res.success && res.data) this.saveSession(res.data); })
    );
  }

  login(email: string, password: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API}/login`, { email, password }).pipe(
      tap((res) => { if (res.success && res.data) this.saveSession(res.data); })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._user.set(null);
  }

  getMe(): Observable<ApiResponse<{ user: User }>> {
    return this.http.get<ApiResponse<{ user: User }>>(`${this.API}/me`).pipe(
      tap((res) => { if (res.success && res.data) this._user.set(res.data.user); })
    );
  }

  updateProfile(data: { name: string; phone?: string }): Observable<ApiResponse<{ user: User }>> {
    return this.http.put<ApiResponse<{ user: User }>>(`${this.API}/profile`, data).pipe(
      tap((res) => { if (res.success && res.data) { this._user.set(res.data.user); this.saveUser(res.data.user); } })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.API}/password`, { currentPassword, newPassword });
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private saveSession(data: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, data.token);
    this.saveUser(data.user);
    this._user.set(data.user);
  }

  private saveUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private loadUser(): User | null {
    try {
      const u = localStorage.getItem(this.USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  }
}
