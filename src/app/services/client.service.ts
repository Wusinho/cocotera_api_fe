import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
  id: number;
  apellidos: string;
  nombres: string;
  dni: string;
  direccion: string;
  telefono: string;
  email: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = '/api/clientes';

  constructor(private http: HttpClient) {}

  getClients(page: number = 0, size: number = 8): Observable<PageResponse<Client>> {
    return this.http.get<PageResponse<Client>>(`${this.baseUrl}/listar?page=${page}&size=${size}`);
  }

  getClient(id: number): Observable<Client>{
    return this.http.get<Client>(`${this.baseUrl}/${id}`)
  }

  updateClient(id: number, client: Client): Observable<any> {
    return this.http.put(`${this.baseUrl}/actualizar/${id}`, client);
  }

}

