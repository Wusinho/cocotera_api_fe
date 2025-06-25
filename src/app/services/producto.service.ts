import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = `${environment.apiUrl}/admin/productos`;

  constructor(private http: HttpClient) {}

  // Get all products
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  // Get a product by ID
  getProducto(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Create a new product
  crearProducto(producto: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, producto);
  }

  // Update existing product
  actualizarProducto(id: number, producto: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, producto);
  }

  // Delete product (optional)
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // Load available tallas (sizes)
  getTallas(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/admin/tallas`);
  }
}

