import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { ProductoService } from '../../services/producto.service';
import { FacturaService } from '../../services/factura.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-factura-create',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './factura-create.component.html',
  styleUrl: './factura-create.component.css'
})
export class FacturaCreateComponent {
  clientId: number = 0;
  productos: any[] = [];
  selectedProducts: { productoId: number; cantidad: number; total: number }[] = [];

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private facturaService: FacturaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.clientId = Number(this.route.snapshot.paramMap.get('clientId'));
    this.loadProductos();
  }

  loadProductos() {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data.map(producto => ({ ...producto, cantidad: 0 }));
    });
  }

  goBack() {
    this.router.navigate(['/clients']);
  }
incrementCantidad(producto: any) {
    producto.cantidad++;
  }

  decrementCantidad(producto: any) {
    if (producto.cantidad > 0) {
      producto.cantidad--;
    }
  }

  calcularTotal(): number {
    return this.productos.reduce((sum, producto) => {
      return sum + (producto.cantidad * producto.precio);
    }, 0);
  }

  createFactura() {
    const productosSeleccionados = this.productos
      .filter(p => p.cantidad > 0)
      .map(p => ({
        productoId: p.id,
        cantidad: p.cantidad,
        total: p.precio * p.cantidad
      }));

    if (productosSeleccionados.length === 0) {
      alert('Debes seleccionar al menos un producto.');
      return;
    }

    const facturaRequest = {
      clienteId: this.clientId,
      productos: productosSeleccionados
    };

    this.facturaService.crearFactura(facturaRequest).subscribe(response => {
      console.log('Factura creada exitosamente!', response);
      this.router.navigate(['/clients']);
    });
  }
}
