import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { AuthStatus, User } from '@auth/interfaces/user.interface';

import { environment } from '@environments/environment';
import { catchError, map, Observable, of, pipe, throwError } from 'rxjs';

const baseUrl = environment.BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  checkStatusResource = rxResource({
    loader: () => this.checkStatus(),
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(this._token);
  isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        map((response) => this.handleAuthSuccess(response)),
        catchError((err) => this.handleAuthError(err))
      );
  }

  checkStatus() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      of(false);
    }

    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`).pipe(
      map((response) => this.handleAuthSuccess(response)),
      catchError((err) => this.handleAuthError(err))
    );
  }

  register(
    email: string,
    password: string,
    fullName: string
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/register`, {
        email,
        password,
        fullName,
      })
      .pipe(
        catchError((err) => {
          const errorMessage = err.error?.message;
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
  }

  private handleAuthSuccess(response: AuthResponse) {
    this._authStatus.set('authenticated');
    this._user.set(response.user);
    this._token.set(response.token);

    localStorage.setItem('token', response.token);
    return true;
  }

  private handleAuthError(err: any) {
    this.logout();
    return of(false);
  }
}
