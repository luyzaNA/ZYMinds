import { Component } from '@angular/core';
import {User} from "../../shared/user";
import {ProfileService} from "../../services/profile.service";
import {AuthService} from "../../services/auth.service";
import {ProfileI} from "../../shared/Profile";

@Component({
  selector: 'app-coach-card',
  templateUrl: './coach-card.component.html',
  styleUrls: ['./coach-card.component.css']
})
export class CoachCardComponent {
  currentUser!: User;
  constructor(protected profileService: ProfileService, protected authService: AuthService) {

this.currentUser = this.authService.getCurrentUser();

  }

}
