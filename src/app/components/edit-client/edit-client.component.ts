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
    if (this.client) {
      this.clientService.updateClient(this.clientId, this.client).subscribe(response => {
        this.router.navigate(['/clients']); // Redirect back to list after saving
      });
    }
  }

  goBack() {
    this.router.navigate(['/clients']);
  }
}
