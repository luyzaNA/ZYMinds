import { Component } from '@angular/core';
// import {CoachCardService} from "../../services/coach-card.service";
import {AuthService} from "../../services/auth.service";
import {User} from "../../shared/user";

@Component({
  selector: 'app-coach-card',
  templateUrl: './coach-card.component.html',
  styleUrls: ['./coach-card.component.css']
})
export class CoachCardComponent {
  userName: string='';
  currentUser: User | null = null;
  constructor(public authService: AuthService) {
    this.currentUser= authService.getCurrentUser()
    if(this.currentUser)
        this.userName =this.currentUser.fullName;
  }
}
