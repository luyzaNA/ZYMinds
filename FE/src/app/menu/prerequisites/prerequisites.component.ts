import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {User} from "../../shared/User/UserI";
import {ProfileService} from "../../services/profile.service";
import {Prerequisites} from "../../shared/Prerequisites/PrerequisitesI";
import {PrerequisitesService} from "../../shared/Prerequisites/prerequisites.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MenuService} from "../../services/menu-service.service";

@Component({
  selector: 'app-prerequisites',
  templateUrl: './prerequisites.component.html',
  styleUrls: ['./prerequisites.component.css']
})
export class PrerequisitesComponent implements OnInit {

  currentUser: User = new User();
  prerequisites: Prerequisites = new Prerequisites();
  prerequisitesLoaded: boolean = false;
  isClient: boolean = true;
  foods: any;

  constructor(private authService: AuthService,
              private profileService: ProfileService,
              private prerequisitesService: PrerequisitesService,
              private route: ActivatedRoute,
              private navRoute: Router,
              private menuService: MenuService){
  }

  ngOnInit(): void {
    this.menuService.getFoods().subscribe(() => {
    });
    this.menuService.foods$.subscribe((foods:any) => {
      this.foods = foods;
    });
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.getAgeFromProfile();
      this.prerequisites.linkId = this.route.snapshot.paramMap.get('id')!;
      this.getPrerequisitesSet();
    });
    this.isClient = this.currentUser.roles === 'CLIENT';
    this.getAgeFromProfile();
    this.prerequisites.linkId = this.route.snapshot.paramMap.get('id')!;
    this.getPrerequisitesSet();
  }

  getAgeFromProfile() {
    this.profileService.getProfile(this.currentUser.id).subscribe(profile => {
      this.prerequisites.age = profile.age;
    }, error => {
      console.log(error);
    });
  }

  setPrerequisitesSet() {
    if (this.prerequisites.id) {
      this.prerequisitesService.updatePrerequisites(this.prerequisites.id, this.prerequisites).subscribe(
        (response) => {
          this.prerequisites = response;
          this.getPrerequisitesSet()
          alert("Prerequisites updated successfully")
        },
        (error) => {
          console.error("Error updating prerequisites:", error);
        }
      );
    } else {
      this.prerequisitesService.createPrerequisites(this.prerequisites).subscribe(
        (response) => {
          this.prerequisites = response;
          this.getPrerequisitesSet()
          alert("Prerequisites created successfully")
        },
        (error) => {
          console.error("Error creating prerequisites:", error);
        }
      );
    }
  }

  getPrerequisitesSet() {
    this.prerequisitesService.getPrerequisitesByLink(this.prerequisites.linkId).subscribe(
      (response) => {
        this.prerequisites = response;
        this.prerequisitesLoaded = true;
      },
      (error) => {
        if (!this.prerequisites.id && !this.isClient) {
          this.navRoute.navigate(['/coach/clients'])
        }
      })
  }

  getIngredientName(name: string) {
    let regex = /\d+\s*(g|ml|kg|l)\s*(.*)/i;
    let match = name.match(regex);

    if (match) {
      let result = match[2].trim();
      return result.charAt(0).toUpperCase() + result.slice(1);
    } else {
      return "No match found";
    }
  }
}
