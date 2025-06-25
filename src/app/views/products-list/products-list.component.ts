import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-list.component.html',
})
export class ProductsListComponent implements OnInit {
  productos: any[] = [];

  constructor(private productoService: ProductoService, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.productoService.getProductos().subscribe({
      next: data => {
        this.productos = data;
      },
      error: err => console.error('Error al obtener productos', err)
    });
  }

  crearProducto() {
    this.router.navigate(['/productos/create']);
  }
}

