import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface AuthState {
  token: string;
  username: string;
  role: 'ATHLETE' | 'DOCTOR' | 'ADMIN';
  displayName: string;
  athleteId: string;
}

const STORAGE_KEY = 'sbnz_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private base = 'http://localhost:8080/api/auth';

  state = signal<AuthState | null>(this.load());
  isAuthed = computed(() => !!this.state());
  role = computed(() => this.state()?.role ?? null);

  private load(): AuthState | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  login(username: string, password: string): Observable<AuthState> {
    return this.http.post<AuthState>(`${this.base}/login`, { username, password }).pipe(
      tap(s => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
        this.state.set(s);
      })
    );
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    this.state.set(null);
    this.router.navigate(['/login']);
  }

  token(): string | null {
    return this.state()?.token ?? null;
  }
}
