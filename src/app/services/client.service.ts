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
  tipoClienteId: number;
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
  providedIn: 'root',
})
export class ClientService {
  private baseUrl = '/admin/clientes';

  constructor(private http: HttpClient) {}

  getClients(
    page: number,
    size: number,
    tipoClienteId?: number,
  ): Observable<PageResponse<Client>> {
    const params: any = {
      page,
      size,
    };

    if (tipoClienteId != null) {
      params.tipo_cliente_id = tipoClienteId;
    }

    return this.http.get<PageResponse<Client>>(`${this.baseUrl}`, { params });
  }

  getClientsWithParams(params: any): Observable<PageResponse<Client>> {
    return this.http.get<PageResponse<Client>>('/admin/clientes', {
      params,
    });
  }

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  updateClient(id: number, client: Client): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, client);
  }
}
