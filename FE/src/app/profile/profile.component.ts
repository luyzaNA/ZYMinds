import {Component} from '@angular/core';
import {ProfileService} from "../services/profile.service";
import {FileUploadService} from "../services/upload.service";
import {AuthService} from "../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../shared/User/UserI";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  currentUser: User = new User();
  isEditing: boolean = false;

  constructor(public profileService: ProfileService,
              private fileService: FileUploadService,
              private authService: AuthService,
              private router: Router) {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    })
console.log(this.currentUser)
    this.fileService.getFiles(this.currentUser.id, "PROFILE").subscribe(
      (response) => {
        this.profileService.photoUrl = response[0].awsLink;
      }
    );
    this.profileService.getProfile(this.currentUser.id).subscribe(
      (profile) => {
        this.profileService.profileI = profile;
      }
    )

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
