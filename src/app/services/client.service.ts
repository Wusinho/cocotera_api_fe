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

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = '/api/clientes';

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}/listar`);
  }

  getClient(id: number): Observable<Client>{
    return this.http.get<Client>(`${this.baseUrl}/${id}`)
  }

  updateClient(id: number, client: Client): Observable<any> {
    return this.http.put(`${this.baseUrl}/actualizar/${id}`, client);
  }

}

