import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Factura {
  id: number;
  cliente_id: number;

}

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private baseUrl = '/api/facturas';

  constructor(private http: HttpClient) {}

  crearFactura(facturaRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/crear`, facturaRequest);
  }

  getFacturasByCliente(clienteId: number): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.baseUrl}/${clienteId}`);
  }
}

