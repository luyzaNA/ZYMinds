import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, switchMap, tap} from 'rxjs/operators';
import {environment} from "../shared/environment"
import {BehaviorSubject, catchError, Observable, of, throwError} from "rxjs";
import {User, UserI} from "../shared/User/UserI";
import {ErrorServiceService} from "./error-service.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;
  private currentUser: User = new User();
  currentUserSubject = new BehaviorSubject<User>(new User());
  currentUser$: Observable<UserI> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient,
              private errorService: ErrorServiceService) {
  }

  registerUser(userData: User): Observable<string> {
    return this.http.post<any>(`${this.baseUrl}/users/create`, userData).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          return response.id;
        } else {
          this.errorService.errorSubject.next(response.message || 'Authentication failed.');
        }
      }),
      switchMap(id => this.fetchCurrentUser().pipe(map(user => {
        return user.id;
      }))),
      catchError(error => {
        this.errorService.errorSubject.next(error.error.message || 'Registration failed.');
        return throwError(error);
      })
    );
  }

  loginUser(email: string, password: string): Observable<UserI> {
    return this.http.post<any>(`${this.baseUrl}/login`, {email, password}).pipe(
      map(response => {
        console.log(response)
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          return response.token;
        } else {
          this.errorService.errorSubject.next(response.message || 'Authentication failed.');
        }
      }),
      switchMap(token => this.fetchCurrentUser()),
      catchError(error => {
        this.errorService.errorSubject.next(error.error.message || 'Authentication failed.');
        return throwError(error);
      })
    );
  }

  fetchCurrentUser(): Observable<UserI> {
    console.log("fetching user")
    return this.http.get<UserI>(`${this.baseUrl}/me`).pipe(
      map(response => {
        this.currentUser = response;
        console.log(this.currentUser)
        this.currentUserSubject.next(this.currentUser);
        return this.currentUser;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }


  getCurrentUser(): Observable<UserI> {
    if (!this.currentUser.id) {
      this.fetchCurrentUser().pipe(map(response => {
        this.currentUserSubject.next(response);
        return this.currentUser$;
      }));
    }
    return this.currentUser$;
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/logout`, {}).pipe(
      map(response => {
        localStorage.removeItem('token');
        this.currentUserSubject.next(new User());
        return response;
      }),
      catchError(error => {
        this.errorService.errorSubject.next(error.error.message || 'Logout failed.');
        return throwError(error);
      })
    );
  }
}
