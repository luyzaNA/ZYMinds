import {Component} from '@angular/core';
import {CoachService} from "../../shared/Coach/coach.service";
import {Coach} from "../../shared/Coach/CoachI";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {

  clientsApproved: Coach[] = [];
  clientsInPending: Coach[] = [];
  clientsRejected: Coach[] = [];

  constructor(private coachService: CoachService) {
    this.fetchClients();
  }

  fetchClients(): void {
    this.coachService.getClietsByCoach().subscribe((coaches: Coach[]) => {
      this.clientsApproved = coaches.filter(coach => coach.status === 'approved');
      this.clientsInPending = coaches.filter(coach => coach.status === 'pending');
      this.clientsRejected = coaches.filter(coach => coach.status === 'rejected');
    });
  }

  updateStatus(client: Coach): void {
    this.coachService.updateClientStatus(client.clientId, client.status).subscribe(response => {
      if (client.status === 'approved' || client.status === 'rejected') {
        this.removeFromPending(client.clientId);
      }
      this.fetchClients();
    }, error => {
      console.error("Error updating status:", error);
    });
  }

  removeFromPending(clientId: string): void {
    this.clientsInPending = this.clientsInPending.filter(c => c.clientId !== clientId);
  }

  editStatus(client: Coach) {
    this.updateStatus(client);
  }
}


