import {Component} from '@angular/core';
import {ProfileService} from "../services/profile.service";
import {FileUploadService} from "../services/upload.service";
import {AuthService} from "../services/auth.service";
import {User} from "../shared/user";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  currentUser!: User;
  isEditing: boolean = false;

  constructor(public profileService: ProfileService,
              private fileService: FileUploadService,
              private authService: AuthService,
              private router: Router) {
    this.currentUser = this.authService.getCurrentUser()

    this.currentUser = this.authService.getCurrentUser()
    this.fileService.getFiles(this.currentUser.id, "PROFILE").subscribe(
      (response) => {
        this.profileService.photoUrl = response[0].awsLink;
      }
    );

  }



  toToEdit(): void {
    this.isEditing = true;
    this.router.navigate(['coach', 'edit-profile']);
    this.router.navigate(this.currentUser.roles === 'COACH' ?
      ['coach', 'edit-profile'] : ['client', 'edit-profile']);
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

}
