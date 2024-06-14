import { Component } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import {User} from "../../shared/User/UserI";
import {pipe} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {
  isLoggedIn!: boolean;
  user: User = new User();


  constructor(private authService: AuthService, private router: Router) {
   this.authService.currentUser$.subscribe(user => {
     this.user = user
     console.log(this.user)
     if(user.id){
       this.isLoggedIn = true;
     }
   })

  }



  logOutUser(): void {
    this.authService.logout().subscribe(
      () => {
        this.isLoggedIn = false;
        alert("Delogarea s-a efectuat cu succes");
        this.router.navigate(['/first-page']);
      },
      error => {
        console.error('Logout failed:', error);
      }
    );
  }
}
