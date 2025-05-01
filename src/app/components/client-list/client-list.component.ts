import { Component, OnInit } from '@angular/core';
import { ClientService, Client } from '../../services/client.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit {

  clients: Client[] = [];
  searchTerm: string = '';

  constructor(
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientService.getClients().subscribe(data => {
      this.clients = data;
    });
  }

  editClient(clientId: number) {
    this.router.navigate(['/clients/edit', clientId])
  }

  get filteredClients(): Client[] {
    return this.clients.filter(client =>
      client.nombres.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  facturarClient(clientId: number){
    this.router.navigate(['/facturas/create', clientId]);
  }

}
