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
  filteredClients: Client[] = [];
  searchTerm: string = '';

  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 1;

  constructor(
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientService.getClients().subscribe(data => {
      this.clients = data.content;
    });
  }

  updatePagination(){
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredClients = this.clients.slice(start, end);
    this.totalPages = Math.ceil(this.clients.length / this.itemsPerPage);
  }

  editClient(clientId: number) {
    this.router.navigate(['/clients/edit', clientId])
  }

  goToPage(page: number){
    if (page >= 1 && page <= this.totalPages){
      this.currentPage = page;
      this.updatePagination();
    }
  }

  facturarClient(clientId: number){
    this.router.navigate(['/facturas/create', clientId]);
  }

}
