import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {User} from "../../shared/User/UserI";
import {ProfileService} from "../../services/profile.service";
import {Prerequisites} from "../../shared/Prerequisites/PrerequisitesI";
import {PrerequisitesService} from "../../shared/Prerequisites/prerequisites.service";

@Component({
  selector: 'app-prerequisites',
  templateUrl: './prerequisites.component.html',
  styleUrls: ['./prerequisites.component.css']
})
export class PrerequisitesComponent implements OnInit {

  currentUser: User = new User();
  prerequisites =  new Prerequisites()
  currentUserLoaded: boolean = false;



  constructor(private authService: AuthService,
              private profileService: ProfileService,
              private prerequisitesService:PrerequisitesService) {
  }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser(){
    this.authService.fetchCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.currentUserLoaded = true;
      this.getAgeFromProfile();
    }, error => {
      console.log(error);
    });
  }

  getAgeFromProfile(){
    if(this.currentUserLoaded){
      this.profileService.getProfile(this.currentUser.id).subscribe(profile => {
        this.prerequisites.age = profile.age;
      }, error => {
        console.log(error);
      });
    }
  }intoleranceInput=''

  createPrerequisitesSet() {
    this.prerequisitesService.createPrerequisites(this.prerequisites).subscribe(
      (response) => {
        console.log("Prerequisites created successfully:", response);
      },
      (error) => {
        console.error("Error creating prerequisites:", error);
      }
    );
  }



}
