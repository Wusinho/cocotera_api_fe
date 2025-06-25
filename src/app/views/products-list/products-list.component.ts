import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-list.component.html',
})
export class ProductsListComponent implements OnInit {
  productos: any[] = [];

  constructor(private productoService: ProductoService, private auth: AuthService) {}

  ngOnInit(): void {
    this.productoService.getProductos().subscribe({
      next: data => {
        this.productos = data;
      },
      error: err => console.error('Error al obtener productos', err)
    });
  }
}

