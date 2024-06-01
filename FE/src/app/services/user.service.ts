import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../shared/environment";
import {Observable} from "rxjs";
import {User} from "../shared/user";
import {map, switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  deleteUser(id: string): Observable<User | Object> {
    return this.http.delete(environment.apiUrl + '/users/' + id);
  }


  updateUser(id: string, email: string, fullName: string, phoneNumber: string, roles: String): Observable<{updateUser: User, token: string}> {
    const payload = {
      email: email,
      fullName: fullName,
      phoneNumber: phoneNumber,
      roles: roles
    };

    return this.http.put<{updateUser: User, token: string}>(`${environment.apiUrl}/users/${id}`, payload).pipe(
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


  getAllUser(): Observable<User[]> {
    return this.http.get<User[]>(environment.apiUrl + '/users');
  }

  updateUserStatus(user: User, newStatus: boolean): Observable<Object> {
    user.newCoach = newStatus;
    return this.http.patch(environment.apiUrl + '/users/new/' + user.id, {newCoach: newStatus});
  }
}
