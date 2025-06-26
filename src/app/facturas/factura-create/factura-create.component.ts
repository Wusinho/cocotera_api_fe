import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { FacturaService } from '../../services/factura.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  disponible: string;
  categoria: string;
  cantidad: number;
}

@Component({
  selector: 'app-factura-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './factura-create.component.html',
})
export class FacturaCreateComponent implements OnInit {
  clientId: number = 0;
  productos: Producto[] = [];
  categorias: string[] = ['Short', 'Casaca', 'Pantalón'];
  categoriaSeleccionada: string = 'Todas';
  productosFiltrados: Producto[] = [];

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private facturaService: FacturaService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.clientId = Number(this.route.snapshot.paramMap.get('clientId'));
    this.loadProductos();
  }

  loadProductos() {
    this.productoService.getProductos().subscribe((data) => {
      this.productos = data.map((producto) => ({
        ...producto,
        cantidad: 0, // Initialize quantity for all products
        categoria: producto.categoria || 'Sin Categoría', // Ensure category exists
      }));
      this.categorias = [
        'Todas',
        ...new Set(this.productos.map((p) => p.categoria)),
      ];
      this.filtrarProductos(); // Initial filter
    });
  }

  filtrarProductos(): void {
    const productosConCantidad = this.productos.filter((p) => p.cantidad > 0);
    let productosPorCategoria: Producto[] = [];

    if (this.categoriaSeleccionada === 'Todas') {
      productosPorCategoria = this.productos;
    } else {
      productosPorCategoria = this.productos.filter(
        (p) => p.categoria === this.categoriaSeleccionada,
      );
    }

    // Combine products with quantity > 0 and products from the selected category
    const combinedProducts = new Map<number, Producto>();

    productosConCantidad.forEach((p) => combinedProducts.set(p.id, p));
    productosPorCategoria.forEach((p) => {
      if (!combinedProducts.has(p.id)) {
        combinedProducts.set(p.id, p);
      }
    });

    this.productosFiltrados = Array.from(combinedProducts.values());
  }

  goBack() {
    this.router.navigate(['/clients']);
  }

  incrementCantidad(producto: Producto) {
    producto.cantidad++;
    this.filtrarProductos(); // Re-filter to ensure visibility if category changes
  }

  decrementCantidad(producto: Producto) {
    if (producto.cantidad > 0) {
      producto.cantidad--;
      this.filtrarProductos(); // Re-filter to ensure visibility if quantity drops to 0
    }
  }

  calcularTotal(): number {
    return this.productos.reduce((sum, producto) => {
      return sum + producto.cantidad * producto.precio;
    }, 0);
  }

  createFactura() {
    const productosSeleccionados = this.productos
      .filter((p) => p.cantidad > 0)
      .map((p) => ({
        productoId: p.id,
        cantidad: p.cantidad,
        total: p.precio * p.cantidad,
      }));

    if (productosSeleccionados.length === 0) {
      alert('Debes seleccionar al menos un producto.');
      return;
    }

    const facturaRequest = {
      clienteId: this.clientId,
      productos: productosSeleccionados,
    };

    this.facturaService.crearFactura(facturaRequest).subscribe((response) => {
      console.log('Factura creada exitosamente!', response);
      this.router.navigate(['/clients']);
    });
  }
}
