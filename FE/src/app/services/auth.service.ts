import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';
import {environment} from "../shared/environment"
import {catchError, Observable, throwError} from "rxjs";
import {Router} from "@angular/router";
import {User, UserI} from "../shared/User/UserI";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;
  private currentUser: User = new User();

  constructor(private http: HttpClient, private router: Router) {

  }

  registerUser(userData: User): Observable<UserI> {
    return this.http.post<any>(`${this.baseUrl}/users/create`, userData).pipe(
      switchMap(() => {
        if (userData.email !== null && userData.password !== null) {
          return this.loginUser(userData.email, userData.password);
        } else {
          throw new Error('Email is null.');
        }
      })
    );
  }

  loginUser(email: string, password: string): Observable<UserI> {
    return this.http.post<any>(`${this.baseUrl}/login`, {email, password}).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          alert('LOGIN SUCCESSFUL');
          return response.token;
        } else {
          throw new Error(response.message || 'Authentication failed.');
        }
      }),
      switchMap(token => this.fetchCurrentUser())
    );
  }

  fetchCurrentUser(): Observable<UserI> {
    return this.http.get<UserI>(`${this.baseUrl}/me`).pipe(
      map(response => {
        this.currentUser = response;
        return this.currentUser;
      }),
      catchError(error => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }

  getCurrentUser(): UserI{
    if(!this.currentUser.id){
      this.fetchCurrentUser().pipe(map(response => {
        this.currentUser = response;
        return this.currentUser;
      }));
    }
    return this.currentUser;
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/logout`, {}).pipe(
      map(response => {
        console.log('Logout successful');
        localStorage.removeItem('token');
        return response;
      })
    );
  }
}
