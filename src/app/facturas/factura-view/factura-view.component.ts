import { Component, OnInit} from '@angular/core';
import { Factura, FacturaService } from '../../services/factura.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-factura-view',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './factura-view.component.html',
  styleUrl: './factura-view.component.css'
})

export class FacturaViewComponent implements OnInit {
  clientId: number = 0

  facturas: Factura[] = [];
  constructor(
    private route: ActivatedRoute,
    private facturaService: FacturaService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('clientId'));

    this.facturaService.getFacturasByCliente(this.clientId).subscribe(data =>
      this.facturas = data
    )};

  getSubTotal(factura: Factura): number {
    return factura.productos.reduce((sum, item) => sum + item.total, 0);
  }

  getIGV(factura: Factura): number {
    return this.getSubTotal(factura) * 0.18;
  }

  getTotalConIGV(factura: Factura): number {
    return this.getSubTotal(factura) + this.getIGV(factura);
  }

  goBack() {
    this.router.navigate(['/clients']);
  }
}
