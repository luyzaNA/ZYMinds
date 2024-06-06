import { Component } from '@angular/core';
import {LinkService} from "../../shared/Link/link.service";
import {ProfileInformation} from "../../shared/ProfileInformation/ProfileInformationI";
import {Router} from "@angular/router";

@Component({
  selector: 'app-client-dashbord',
  templateUrl: './client-dashbord.component.html',
  styleUrls: ['./client-dashbord.component.css']
})
export class ClientDashbordComponent {

  statusRequest: string = 'pending'
  connection: boolean = false;
  profileInformation = new ProfileInformation();

  constructor(private linkService: LinkService,
              private router: Router) {
    this.getConnection()
  }

  getConnection(): void {
    this.linkService.getClientConnection().subscribe(
      (profileInfo) => {
        this.connection = true;
        this.statusRequest = profileInfo.statusApplication;
        this.profileInformation.age = profileInfo.age;
        this.profileInformation.description = profileInfo.description;
        this.profileInformation.rating = profileInfo.rating;
        this.profileInformation.price = profileInfo.price;
        this.profileInformation.awsLink = profileInfo.awsLink;
        this.profileInformation.fullName = profileInfo.fullName;
        this.profileInformation.id = profileInfo.id;
      },
      (error) => {
        console.error('Eroare la crearea conexiunii:', error);
      }
    );
  }

  revokeConnection() {
    console.log(this.statusRequest)
    if (this.statusRequest === 'pending') {
      this.linkService.deleteConnection().subscribe(
        (response) => {
          this.connection = false
          alert("Cererrea de conectare a fost incheieta cu succes");
        },
        (error) => {
          console.error('Eroare la crearea conexiunii:', error);
        }
      );
    }
  }

  navigateToDetails(): void {
    console.log(this.profileInformation.id)
    this.router.navigate([`/client/menus/${this.profileInformation.id}`]);
  }
}
