import { Component } from '@angular/core';
import {ClientService} from "../../shared/Client/client.service";
import {ProfileInformation} from "../../shared/ProfileInformation/ProfileInformationI";

@Component({
  selector: 'app-client-dashbord',
  templateUrl: './client-dashbord.component.html',
  styleUrls: ['./client-dashbord.component.css']
})
export class ClientDashbordComponent {

  statusRequest= 'pending'
  profileInformation = new ProfileInformation();
  constructor(private clientService: ClientService) {
    this.getConnection()
  }

  getConnection(): void {
    this.clientService.getClientConnection().subscribe(
      (profileInfo) => {
        this.statusRequest = profileInfo.statusApplication;
        this.profileInformation.age=profileInfo.age;
        this.profileInformation.description=profileInfo.description;
        this.profileInformation.rating=profileInfo.rating;
        this.profileInformation.price=profileInfo.price;
        this.profileInformation.awsLink=profileInfo.awsLink;
        this.profileInformation.fullName=profileInfo.fullName;
      },
      (error) => {
        console.error('Eroare la crearea conexiunii:', error);
      }
    );
  }

}
