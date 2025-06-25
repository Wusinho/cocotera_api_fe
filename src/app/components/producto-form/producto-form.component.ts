import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  editing = false;
  tallas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      color: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      tallaId: [null, Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editing = true;
      this.productService.getProduct(+id).subscribe(product => {
        this.form.patchValue({
          ...product,
          tallaId: product.talla?.id
        });
      });
    }

    this.productService.listTallas().subscribe(tallas => {
      this.tallas = tallas;
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const productData = this.form.value;

    if (this.editing) {
      const id = +this.route.snapshot.paramMap.get('id')!;
      this.productService.updateProduct(id, productData).subscribe(() => {
        this.router.navigate(['/products']);
      });
    } else {
      this.productService.createProduct(productData).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }
}
