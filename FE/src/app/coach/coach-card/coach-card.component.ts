import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {User} from "../../shared/user";

@Component({
  selector: 'app-coach-card',
  templateUrl: './coach-card.component.html',
  styleUrls: ['./coach-card.component.css']
})
export class CoachCardComponent {
  currentUser!: User;
  constructor(private authService: AuthService) {
    this.currentUser= authService.getCurrentUser()
  }
}
