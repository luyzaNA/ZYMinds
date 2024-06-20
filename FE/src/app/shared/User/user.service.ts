import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environment";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {UserI} from "./UserI";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  deleteUser(id: string): Observable<UserI | Object> {
    return this.http.delete(environment.apiUrl + '/users/' + id);
  }


  updateUser(id: string, email: string, fullName: string, phoneNumber: string, roles: String): Observable<{updateUser: UserI, token: string}> {
    const payload = {
      email: email,
      fullName: fullName,
      phoneNumber: phoneNumber,
      roles: roles
    };

    return this.http.put<{updateUser: UserI, token: string}>(`${environment.apiUrl}/users/${id}`, payload).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        } else {
          throw new Error('Authentication failed.');
        }
        return response;
      })
    );
  }

  getAllUser(): Observable<UserI[]> {
    return this.http.get<UserI[]>(environment.apiUrl + '/users');
  }

  updateUserStatus(user: UserI, newStatus: boolean): Observable<Object> {
    user.newCoach = newStatus;
    return this.http.patch(environment.apiUrl + '/users/new/' + user.id, {newCoach: newStatus});
  }

  getUserById(userId: string): Observable<UserI> {
    return this.http.get<UserI>(`${environment.apiUrl}/users/${userId}`);
  }

  searchUsersByEmail(email: string): Observable<UserI[]> {
    return this.http.get<UserI[]>(`${environment.apiUrl}/users/search/${email}`);
  }
}
