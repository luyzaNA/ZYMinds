import { Component } from '@angular/core';
import {CoachCardService} from "../../services/coach-card.service";

@Component({
  selector: 'app-coach-card',
  templateUrl: './coach-card.component.html',
  styleUrls: ['./coach-card.component.css']
})
export class CoachCardComponent {
  constructor(public coachCardService: CoachCardService) {
  }
}
