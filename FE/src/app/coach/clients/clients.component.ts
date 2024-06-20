import {Component} from '@angular/core';
import {LinkService} from "../../shared/Link/link.service";
import {Coach} from "../../shared/Coach/CoachI";
import {Link, LinkI} from "../../shared/Link/LinkI";
import {ActivatedRoute, Route, Router} from "@angular/router";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {

  clientsApproved: Link[] = [];
  clientsInPending: Link[] = [];
  clientsRejected: Link[] = [];

  constructor(private linkService: LinkService) {
    this.fetchClients();
  }

  fetchClients(): void {
    this.linkService.getClientsByCoach().subscribe((links: LinkI[]) => {
      this.clientsApproved = links.filter(links => links.status === 'approved');
      this.clientsInPending = links.filter(links => links.status === 'pending');
      this.clientsRejected = links.filter(links => links.status === 'rejected');
    });
  }

  updateStatus(link: Link): void {
    this.linkService.updateClientStatus(link.clientId, link.status).subscribe(response => {
      if (link.status === 'approved' || link.status === 'rejected') {
        this.removeFromPending(link.clientId);
      }
      this.fetchClients();
    }, error => {
      console.error("Error updating status:", error);
    });
  }

  removeFromPending(clientId: string): void {
    this.clientsInPending = this.clientsInPending.filter(c => c.clientId !== clientId);
  }

  editStatus(client: Link) {
    this.updateStatus(client);
  }
}


