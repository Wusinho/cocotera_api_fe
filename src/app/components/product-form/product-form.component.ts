import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  editing = false;
  tallas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      color: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      tallaId: [null, Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editing = true;
      this.productService.getProducto(+id).subscribe(product => {
        this.productForm.patchValue({
          ...product,
          tallaId: product.talla_id // Ensure property matches
        });
      });
    }


  this.productService.getTallas().subscribe(tallas => {
    this.tallas = tallas;
    if (!this.editing && this.tallas.length > 0) {
      this.productForm.patchValue({ tallaId: this.tallas[0].id });
    }
  });

  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const productData = this.productForm.value;

    if (this.editing) {
      const id = +this.route.snapshot.paramMap.get('id')!;
      this.productService.actualizarProducto(id, productData).subscribe(() => {
        this.router.navigate(['/productos']);
      });
    } else {
      this.productService.crearProducto(productData).subscribe(() => {
        this.router.navigate(['/productos']);
      });
    }
  }
}
