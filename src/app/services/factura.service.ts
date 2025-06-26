import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from './client.service';
import { environment } from '../../environments/environment';

export interface FacturaProducto {
  id: number;
  producto: {
    id: number;
    nombre: string;
    categoria: string;
    color: string;
    precio: number;
    talla: any; // or define a separate Talla interface
  };
  cantidad: number;
  total: number;
}

export interface Factura {
  id: number;
  cliente: Client;
  productos: FacturaProducto[];
}

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private baseUrl = `${environment.apiUrl}/admin/facturas`;

  constructor(private http: HttpClient) {}

  crearFactura(facturaRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, facturaRequest);
  }

  getFacturasByCliente(clienteId: number): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.baseUrl}/${clienteId}`);
  }
}
