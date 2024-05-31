import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProfileI} from "../shared/Profile";
import {environment} from "../shared/environment";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  profileI: ProfileI={
    _id: '',
    age: 0,
    description: '',
    price: 0,
    rating: 0,
    userId: ''
  }

  photoUrl : string =''
  constructor(private http: HttpClient, private auth: AuthService) {
   // this.auth.fetchCurrentUser().subscribe();
  }

  updateProfile(profile: ProfileI):Observable<Object> {
  return this.http.put<ProfileI>(`${environment.apiUrl}/profile/update/${profile.userId}/`, profile);
  }


updateUserFullName(userId: string, fullName: string): Observable<any> {
    const url = `${environment.apiUrl}/users/${userId}/update-name`;
    return this.http.put(url, { fullName });
  }


  getProfile(id: string): Observable<ProfileI> {
    return this.http.get<ProfileI>(`${environment.apiUrl}/profile/${id}`);
  }


}
