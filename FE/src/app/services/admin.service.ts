import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../shared/environment";
import {Observable} from "rxjs";
import {User} from "../shared/user";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  deleteUser(id: string): Observable<User | Object> {
    return this.http.delete(environment.apiUrl + '/users/' + id);
  }

  updateUser(user: User): Observable<Object> {
    return this.http.patch(environment.apiUrl + '/users/' + user.id, user);
  }

  getAllUser(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  updateUserStatus(user: User, newStatus: boolean): Observable<Object> {
    user.newCoach = newStatus;
    return this.http.patch(environment.apiUrl + '/users/new/' + user.id, { newCoach: newStatus });
  }

}
