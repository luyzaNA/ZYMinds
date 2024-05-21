import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {ActivatedRouteSnapshot, CanActivate, Router} from "@angular/router";
import {JwtHelperService} from '@auth0/angular-jwt';
import {User} from "../shared/user";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  decodeToken(): User | null {
    const helper = new JwtHelperService();
    const token = localStorage.getItem('token');
    if (token && token !== null) {
      return helper.decodeToken(token);
    } else return null;
  }

  getUserRole(): string | null {
    const decodeT = this.decodeToken();
    if (!decodeT) return null;
    return decodeT.roles;
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const roles = this.getUserRole();

    if (roles && roles.includes(expectedRole)) {
      return true;
    } else {
      this.router.navigate(['first-page']);
      return false;
    }
  }
}
