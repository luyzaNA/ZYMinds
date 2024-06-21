import { Component } from '@angular/core';
import {LinkService} from "../../shared/Link/link.service";
import {ProfileInformation, ProfileInformationI} from "../../shared/ProfileInformation/ProfileInformationI";
import {Router} from "@angular/router";

@Component({
  selector: 'app-client-dashbord',
  templateUrl: './client-dashbord.component.html',
  styleUrls: ['./client-dashbord.component.css']
})
export class ClientDashbordComponent {
  profilesInformation: ProfileInformationI[] = [];

  constructor(private linkService: LinkService,
              private router: Router) {
    this.getConnections();
  }

  getConnections(): void {
    this.linkService.getClientConnections().subscribe(
      (profilesInfo: [ProfileInformationI]) => {
        if(!profilesInfo) {
          return;}
        this.profilesInformation = profilesInfo;
      },
      (error) => {
        console.error('Eroare la crearea conexiunii:', error);
      }
    );
  }

  revokeConnection(linkId: string, status: string): void {
    if (status === 'pending') {
      this.linkService.deleteConnection(linkId).subscribe(
        (response) => {
          if(!response){return;}
          this.profilesInformation = this.profilesInformation.filter(profile => profile.id !== response.id);
          alert("Cererea de conectare a fost incheieta cu succes");
        },
        (error) => {
          console.error('Eroare la crearea conexiunii:', error);
        }
      );
    }
  }

  navigateToDetails(id: string): void {
    this.router.navigate([`/client/menus/${id}`]);
  }
}
