import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
  id: number;
  razonSocial: string;
  ruc: string;
  direccion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = '/api/clientes/listar';

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }
}

