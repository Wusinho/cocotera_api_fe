import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
export interface ClientType {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClientTypeService {
  private baseUrl = `${environment.apiUrl}/admin/tipoclientes`;
  constructor(private http: HttpClient) { }

  getClientType(): Observable<ClientType[]> {
    return this.http.get<ClientType[]>(this.baseUrl);
  }
}
