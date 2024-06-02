import {Component, Input} from '@angular/core';
import {User, UserInformation} from "../../shared/user";
import {ProfileService} from "../../services/profile.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-coach-card',
  templateUrl: './coach-card.component.html',
  styleUrls: ['./coach-card.component.css']
})
export class CoachCardComponent {
  currentUser!: User;
  @Input() userProfileInformation!: UserInformation;

  constructor(protected profileService: ProfileService, protected authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }

  applApplForCoaching() {
    console.log("Hei");
  }
}
