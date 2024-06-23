import {Injectable} from '@angular/core';
import {catchError, Observable} from "rxjs";
import {environment} from "../environment";
import {LinkI} from "./LinkI";
import {HttpClient} from "@angular/common/http";
import { ProfileInformationI} from "../ProfileInformation/ProfileInformationI";
import {map} from "rxjs/operators";
import {ErrorServiceService} from "../../services/error-service.service";

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  constructor(private http: HttpClient, private errorService: ErrorServiceService) {
  }

  createConnection(coachId: string, message: string): Observable<LinkI> {
    return this.http.post<LinkI>(`${environment.apiUrl}/connect/${coachId}`, {message: message}).pipe(
      map(response => response),
      catchError(error => {
        this.errorService.errorSubject.next(error.error.message)
      throw error;
    }));
  }

  getClientConnections(): Observable<[ProfileInformationI]> {
    return this.http.get<[ProfileInformationI]>(`${environment.apiUrl}/application/client`);
  }

  deleteConnection(linkId: string): Observable<LinkI> {
    return this.http.delete<LinkI>(`${environment.apiUrl}/delete/connection/${linkId}`);
  }

  getClientsByCoach(): Observable<LinkI[]> {
    return this.http.get<LinkI[]>(`${environment.apiUrl}/clients`);
  }

  updateClientStatus(clientId: string, statusApplication: string): Observable<LinkI> {
    return this.http.patch<LinkI>(`${environment.apiUrl}/update/status/client/${clientId}`, {statusApplication: statusApplication});
  }

}
