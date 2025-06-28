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
        cantidad: 0,
        categoria: producto.categoria || 'Sin Categoría',
      }));
      this.categorias = [
        'Todas',
        ...new Set(this.productos.map((p) => p.categoria)),
      ];
      this.filtrarProductos();
    });
  }

  filtrarProductos(): void {
    const seleccionados = this.productos.filter((p) => p.cantidad > 0);

    const porCategoria =
      this.categoriaSeleccionada === 'Todas'
        ? this.productos
        : this.productos.filter(
          (p) => p.categoria === this.categoriaSeleccionada,
        );

    // Unir ambos sin duplicar
    const set = new Set<number>();
    this.productosFiltrados = [];

    for (let p of [...seleccionados, ...porCategoria]) {
      if (!set.has(p.id)) {
        this.productosFiltrados.push(p);
        set.add(p.id);
      }
    }
  }
  goBack() {
    this.router.navigate(['/clients']);
  }

  incrementCantidad(producto: Producto) {
    const original = this.productos.find((p) => p.id === producto.id);
    if (original) {
      original.cantidad++;
    }
  }

  decrementCantidad(producto: Producto) {
    const original = this.productos.find((p) => p.id === producto.id);
    if (original && original.cantidad > 0) {
      original.cantidad--;
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
