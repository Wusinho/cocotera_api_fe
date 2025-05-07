import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientService, Client } from '../../services/client.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientType, ClientTypeService } from '../../services/clienttype.service';
@Component({
  selector: 'app-edit-client',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.css'
})
export class EditClientComponent implements OnInit {
  clientId: number = 0;
  client?: Client
  clienttypes: ClientType[] = [];
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private clientTypeService: ClientTypeService,
    private router: Router
  ) {}

  ngOnInit(){

    this.clientId = Number(this.route.snapshot.paramMap.get('id'));

    this.clientTypeService.getClientType().subscribe(types => {
      this.clienttypes = types;
    })

    this.clientService.getClient(this.clientId).subscribe(data => {
      this.client = data;
    })
  }

updateClient() {
  this.errorMessage = null;

  if (!this.client) return;

  const {
    apellidos,
    nombres,
    dni,
    direccion,
    telefono,
    email
  } = this.client;

  if (!apellidos || apellidos.trim().length === 0) {
    this.errorMessage = 'Los apellidos son obligatorios.';
    return;
  }

  if (!nombres || nombres.trim().length === 0) {
    this.errorMessage = 'Los nombres son obligatorios.';
    return;
  }

  if (!dni || dni.trim().length < 8) {
    this.errorMessage = 'El DNI debe tener al menos 8 dígitos.';
    return;
  }

  if (!direccion || direccion.trim().length === 0) {
    this.errorMessage = 'La dirección es obligatoria.';
    return;
  }

 if (!telefono || telefono.trim().length < 7 || !this.soloNumeros(telefono)) {
    this.errorMessage = 'El teléfono debe tener al menos 7 dígitos y contener solo números.';
    return;
  }

  if (!email || !this.validarEmail(email)) {
    this.errorMessage = 'El correo electronico no es válido.';
    return;
  }

  this.clientService.updateClient(this.clientId, this.client).subscribe({
    next: response => this.router.navigate(['/clients']),
    error: err => this.errorMessage = 'Error al actualizar el cliente. Intente nuevamente.'
  });
}

validarEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}
soloNumeros(valor: string): boolean {
  return /^[0-9]+$/.test(valor);
}
  goBack() {
    this.router.navigate(['/clients']);
  }
}
