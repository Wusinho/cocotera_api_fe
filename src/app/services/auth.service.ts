import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private tokenKey = 'jwtToken';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(
        `${this.baseUrl}/session`,
        { email, password },
        { observe: 'response' },
      )
      .pipe(
        tap((response) => {
          const authHeader = response.headers.get('Authorization');
          if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.replace('Bearer ', '');
            localStorage.setItem(this.tokenKey, token);
          }
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getAuthHeader(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const { exp } = JSON.parse(atob(token.split('.')[1]));
      return exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }
}
