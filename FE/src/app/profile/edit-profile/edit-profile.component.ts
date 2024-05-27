import { Component } from '@angular/core';
import {User} from "../../shared/user";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {

  currentUser: User| null=null;
  name: string='';

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
    if(this.currentUser !== null) {
      this.name=this.currentUser.fullName;
      console.log(this.currentUser);

    }
  }
}
