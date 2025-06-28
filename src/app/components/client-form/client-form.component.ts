import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form.component.html',
})
export class ClientFormComponent implements OnInit {
  clientForm!: FormGroup;
  editing = false;
  types: any[] = [];
  formErrors: any = {};

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      apellidos: ['', Validators.required],
      nombres: ['', Validators.required],
      dni: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      razonSocial: ['', Validators.required],
      ru: ['', Validators.required],
      tipoClienteId: [null, Validators.required],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editing = true;
      this.clientService.getClient(+id).subscribe((client) => {
        this.clientForm.patchValue({
          ...client,
          tipoClienteId: client.tipoCliente.id,
        });
      });
    }

    this.clientService.getClientType().subscribe((types) => {
      this.types = types;
      if (!this.editing && this.types.length > 0) {
        this.clientForm.patchValue({
          tipoClienteId: this.types[0].id,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) return;

    this.formErrors = {};

    const clientData = {
      ...this.clientForm.value,
      tipoClienteId: +this.clientForm.value.tipoClienteId,
    };

    const req = this.editing
      ? this.clientService.updateClient(
        +this.route.snapshot.paramMap.get('id')!,
        clientData,
      )
      : this.clientService.createClient(clientData);

    req.subscribe({
      next: () => this.router.navigate(['/clients']),
      error: (err) => {
        this.formErrors = err.error;
      },
    });
  }
}
