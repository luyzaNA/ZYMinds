import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {ActivatedRouteSnapshot, CanActivate, Router} from "@angular/router";
import {catchError, Observable, of} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }


  getUserRole(): Observable<string | null> {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      return of(currentUser.roles);
    }
    return this.authService.fetchCurrentUser().pipe(
      map(user => user ? user.roles : null)
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const expectedRole = route.data['expectedRole'];

    return this.getUserRole().pipe(
      map(roles => {
        if (roles && roles.includes(expectedRole)) {
          return true;
        } else {
          this.router.navigate(['first-page']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['first-page']);
        return of(false);
      })
    );
  }
}
