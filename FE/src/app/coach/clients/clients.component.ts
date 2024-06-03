import { Component } from '@angular/core';
import {CoachService} from "../../shared/Coach/coach.service";
import {Coach} from "../../shared/Coach/CoachI";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {

  clients:Coach[]= new Array<Coach>();
  constructor(private coachService: CoachService) {
  this.coachService.getClietsByCoach().subscribe((coach:Coach[]) => {
    this.clients=coach;
    console.log(this.clients);
  });

  }

}
