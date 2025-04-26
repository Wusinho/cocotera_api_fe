import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  saveAuth(username: string, password: string): void {
    const basicAuth = btoa(`${username}:${password}`);
    localStorage.setItem('authToken', basicAuth);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  clearAuth(): void {
    localStorage.removeItem('authToken');
  }
}
