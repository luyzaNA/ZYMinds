import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {User} from "../../shared/User/UserI";
import {pipe} from "rxjs";
import {map} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {
  isLoggedIn!: boolean;
  user: User = new User();
  currentLanguage: string = 'ro';


  constructor(private authService: AuthService, private router: Router, private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user
      console.log(this.user)
      if (user.id !== '') {
        console.log('User is logged in')
        this.isLoggedIn = true;
      } else {
        this.authService.fetchCurrentUser().subscribe(
          (user: any) => {
            console.log('User fetched successfully:', user);
          },
          (error: any) => {
            console.error('Error fetching user:', error);
          }
        );

      }
    })
  }


  logOutUser(): void {
    this.authService.logout().subscribe(
      () => {
        this.isLoggedIn = false;
        this.router.navigate(['/first-page']);
      },
      error => {
        console.error('Logout failed:', error);
      }
    );
  }

  navigateToDashboard() {
    if (this.user.roles === 'COACH') {
      this.router.navigate(['/coach/dashboard'])
    } else if(this.user.roles === 'CLIENT') {
      this.router.navigate(['/client/dashboard'])
    } else if(this.user.roles === 'ADMIN') {
      this.router.navigate(['/admin/management-clients'])
    }
  }

  changeLanguage(value: any) {
    const language = value.target.value;
    this.translateService.use(language);
  }
}
