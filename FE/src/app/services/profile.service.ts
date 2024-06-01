import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProfileI} from "../shared/Profile";
import {environment} from "../shared/environment";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {User, UserInformation} from "../shared/user";

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
  }

  updateProfile(profile: ProfileI):Observable<Object> {
  return this.http.put<ProfileI>(`${environment.apiUrl}/profile/update/${profile._id}`, profile);
  }


  getProfile(id: string): Observable<ProfileI> {
    return this.http.get<ProfileI>(`${environment.apiUrl}/profile/${id}`);
  }

  updateRating(profileId: string, rating: number):Observable<ProfileI> {
    return this.http.put<ProfileI>(`${environment.apiUrl}/rating/update/${profileId}`, rating);
  }

  getProfiles(): Observable<UserInformation[]> {
    return this.http.get<UserInformation[]>(`${environment.apiUrl}/profiles/coach`);
  }


}
