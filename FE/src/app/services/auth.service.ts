import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User} from "../shared/user";
import {environment} from "../shared/environment"
import {Observable} from "rxjs";
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  registerUser(userData: User): Observable<string> {
    return this.http.post<any>(`${this.baseUrl}/users/create`, userData).pipe(
      map(response => response.id)
    );
  }

  loginUser(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, {email, password}).pipe(
      map(response => {
        if (response && response.token) {
          const helper = new JwtHelperService();
          localStorage.setItem('token', response.token);
          return helper.decodeToken(response.token);
        } else {
          throw new Error(response.message || 'Authentication failed.');
        }
      })
    );
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
