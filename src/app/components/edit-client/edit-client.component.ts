import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientService, Client } from '../../services/client.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-client',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.css'
})
export class EditClientComponent implements OnInit {
  clientId: number = 1;
  client?: Client

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(){
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));

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
