import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClientType {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})

export class ClientTypeService {

  constructor(private http: HttpClient) {}


getClientType(): Observable<ClientType[]> {
    console.log("USANDO CLIENTYPE SERVICE")
  return this.http.get<ClientType[]>('/admin/tipoclientes');
}
}
