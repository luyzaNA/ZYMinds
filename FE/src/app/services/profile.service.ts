import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Profile, ProfileI} from "../shared/Profile";
import {environment} from "../shared/environment";
import {catchError, Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {ProfileInformationI} from "../shared/ProfileInformation/ProfileInformationI";
import {map} from "rxjs/operators";
import {ErrorServiceService} from "./error-service.service";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  photoUrl: string = ''

  constructor(private http: HttpClient, private auth: AuthService, private errorService: ErrorServiceService) {
  }

  updateProfile(profile: ProfileI): Observable<Object> {
    return this.http.put<ProfileI>(`${environment.apiUrl}/profile/update/${profile._id}`, profile).pipe(
      map(response => response),
      catchError(error => {
        this.errorService.errorSubject.next(error.error.message);
        throw new Error('Profile not updated');
      })
    );
  }

  getProfile(id: string): Observable<ProfileI> {
    return this.http.get<ProfileI>(`${environment.apiUrl}/profile/${id}`).pipe(
      map(response => response),
      catchError(error => {
        this.errorService.errorSubject.next(error.error.message);
        throw new Error('Profile not found');
      })
    );
  }

  updateRating(profileId: string, rating: number): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}/rating/update/${profileId}`, { rating });
  }

  getProfiles(): Observable<ProfileInformationI[]> {
    return this.http.get<ProfileInformationI[]>(`${environment.apiUrl}/profiles/coach`).pipe(
      map(response => response),
      catchError(error => {
        this.errorService.errorSubject.next(error.error.message);
        throw new Error('Profiles not found');
      })
    );
  }

  getRating(userId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/rating/${userId}`);
  }

}
