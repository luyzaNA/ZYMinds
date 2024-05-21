import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../shared/environment";
import {Observable} from "rxjs";
import {User} from "../shared/user";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {
  }

  deleteUser(id: string): Observable<User | Object> {
    return this.http.delete(environment.apiUrl + '/users/' + id);
  }

  updateUser(id: string, email: string, fullName: string, phoneNumber: number, roles: String): Observable<Object> {
    const payload = {
      email: email,
      fullName: fullName,
      phoneNumber: phoneNumber,
      roles: roles
    };
    return this.http.patch(environment.apiUrl + '/users/' + id, payload);
  }

  getAllUser(): Observable<User[]> {
    return this.http.get<User[]>(environment.apiUrl + '/users');
  }

  updateUserStatus(user: User, newStatus: boolean): Observable<Object> {
    user.newCoach = newStatus;
    return this.http.patch(environment.apiUrl + '/users/new/' + user.id, {newCoach: newStatus});
  }
}
