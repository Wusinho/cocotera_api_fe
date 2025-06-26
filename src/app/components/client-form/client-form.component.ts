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

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      apellidos: ['', Validators.required],
      nombres: ['', Validators.required],
      dni: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
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

    const clientData = {
      ...this.clientForm.value,
      tipoClienteId: +this.clientForm.value.tipoClienteId,
    };

    if (this.editing) {
      const id = +this.route.snapshot.paramMap.get('id')!;
      console.log('ID ' + id);
      this.clientService.updateClient(id, clientData).subscribe(() => {
        this.router.navigate(['/clients']);
      });
    } else {
      this.clientService.createClient(clientData).subscribe(() => {
        this.router.navigate(['/clients']);
      });
    }
  }
}
