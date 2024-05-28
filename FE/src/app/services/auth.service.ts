import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';
import {User} from "../shared/user";
import {environment} from "../shared/environment"
import {catchError, Observable, throwError} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;
  private currentUser: User = {email: '', fullName: '', phoneNumber: 0, roles: '', id: '', password: '', newCoach: false};


  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      this.fetchCurrentUser().subscribe();
    }
  }

  registerUser(userData: User): Observable<string> {
    return this.http.post<any>(`${this.baseUrl}/users/create`, userData).pipe(
      switchMap(() => {
        if (userData.email !== null && userData.password !== null) {
          return this.loginUser(userData.email, userData.password).pipe(
            map(() => userData.email)
          );
        } else {
          throw new Error('Email is null.');
        }
      })
    );
  }

  loginUser(email: string, password: string): Observable<User> {
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

  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`).pipe(
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

  getCurrentUser(): User{
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
