import { Component, OnInit } from '@angular/core';
import { ClientService, Client } from '../../services/client.service';
import {
  ClientTypeService,
  ClientType,
} from '../../services/clienttype.service';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './client-list.component.html',
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  clienttypes: ClientType[] = [];
  selectedClientType: number = 0;
  filteredClients: Client[] = [];
  searchTerm: string = '';

  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 1;

  constructor(
    private clientService: ClientService,
    private clientTypeService: ClientTypeService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadClients();
    this.loadClientTypes();
  }

  loadClientTypes(): void {
    this.clientTypeService.getClientType().subscribe((data) => {
      this.clienttypes = data;
    });
  }

  loadClients(page: number = 1): void {
    const tipoId: number | undefined =
      this.selectedClientType != null && this.selectedClientType !== 0
        ? this.selectedClientType
        : undefined;

    this.clientService
      .getClients(page - 1, this.itemsPerPage, tipoId)
      .subscribe((data) => {
        this.clients = data.content;
        this.totalPages = data.totalPages;
        this.currentPage = data.number + 1;
      });
  }

  onClienTypeChange(): void {
    this.currentPage = 1;
    this.loadClients();
  }

  editClient(clientId: number) {
    this.router.navigate(['/clients/edit', clientId]);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadClients(page);
    }
  }

  facturarClient(clientId: number) {
    this.router.navigate(['/facturas/create', clientId]);
  }

  clientFacturas(clientId: number) {
    this.router.navigate(['/facturas/show', clientId]);
  }

  createClient() {
    this.router.navigate(['/clients/create']);
  }
}
