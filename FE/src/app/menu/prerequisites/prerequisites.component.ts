import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {User} from "../../shared/User/UserI";
import {ProfileService} from "../../services/profile.service";
import {Prerequisites} from "../../shared/Prerequisites/PrerequisitesI";
import {PrerequisitesService} from "../../shared/Prerequisites/prerequisites.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-prerequisites',
  templateUrl: './prerequisites.component.html',
  styleUrls: ['./prerequisites.component.css']
})
export class PrerequisitesComponent implements OnInit {

  //user ul curent pentru a obtine rolul si varsta de pe profil cu user.id
  currentUser: User = new User();

  //setul de prerequisite pentru userul curent
  prerequisites: Prerequisites = new Prerequisites();

  //in functie de ea se face update/create prerequisites
  prerequisitesLoaded: boolean = false;

  //activeaza/dezactiveaza form ul in functie de rolul utilizatorului curent
  isClient: boolean = true;

  constructor(private authService: AuthService,
              private profileService: ProfileService,
              private prerequisitesService: PrerequisitesService,
              private route: ActivatedRoute,
              private navRoute: Router) {
  }

  //obtin user ul curent  si verific rolul lui
  //obtin varsta user ului curent si setez linkId ul de pe url
  //fac cerere de get pt setul de prerequisites
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isClient = this.currentUser.roles === 'CLIENT';
    this.getAgeFromProfile();
    this.prerequisites.linkId = this.route.snapshot.paramMap.get('id')!;
    this.getPrerequisitesSet();
  }

  //cu user id ul fac get de profil pt a obtine varsta
  getAgeFromProfile() {
    this.profileService.getProfile(this.currentUser.id).subscribe(profile => {
      this.prerequisites.age = profile.age;
    }, error => {
      console.log(error);
    });
  }

  //daca exista id salvat in prerequisites inseamna ca exista un set creat si se va face update dupa id
  //daca nu exista se va face create
  setPrerequisitesSet() {
    if (this.prerequisites.id) {
      this.prerequisitesService.updatePrerequisites(this.prerequisites.id, this.prerequisites).subscribe(
        (response) => {
          this.prerequisites = response;
          this.getPrerequisitesSet()
          console.log("Prerequisites updated successfully:", response);
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
          console.log("Prerequisites created successfully:", response);
        },
        (error) => {
          console.error("Error creating prerequisites:", error);
        }
      );
    }
  }

  //se obtine setul de prerequisites dupa link id
  //in caz de eroare ma redirectioneaza catre dashboard
  getPrerequisitesSet() {
    this.prerequisitesService.getPrerequisitesByLink(this.prerequisites.linkId).subscribe(
      (response) => {
        this.prerequisites = response;
        this.prerequisitesLoaded = true;
      },
      (error) => {
        if (!this.prerequisites.id && !this.isClient) {
          alert('Formularul nu a fost inca incarcat de client');
          this.navRoute.navigate(['/coach/clients'])
        }
      })
  }
}
