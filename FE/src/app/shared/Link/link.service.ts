import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../environment";
import {LinkI} from "./LinkI";
import {HttpClient} from "@angular/common/http";
import {ProfileI} from "../Profile";
import {ProfileInformation, ProfileInformationI} from "../ProfileInformation/ProfileInformationI";
import {CoachI} from "../Coach/CoachI";

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  constructor(private http: HttpClient) {
  }

  createConnection(coachId: string, message: string): Observable<LinkI> {
    return this.http.post<LinkI>(`${environment.apiUrl}/connect/${coachId}`, {message: message});
  }

  getClientConnection(): Observable<{age: number, price: number,
                                     fullName: string, description: string,
                                     statusApplication: string, rating: number, awsLink: string, id:string }> {
    return this.http.get<{age: number, price: number,
                          fullName: string, description: string,
                          statusApplication: string, rating: number, awsLink: string, id:string}>(`${environment.apiUrl}/application/client`);
  }

  deleteConnection(): Observable<LinkI> {
    return this.http.delete<LinkI>(`${environment.apiUrl}/delete/connection`);
  }
  getClientsByCoach():Observable<LinkI[]>{
    return this.http.get<LinkI[]>(`${environment.apiUrl}/clients`);
  }

  updateClientStatus(clientId: string, statusApplication: string): Observable<LinkI> {
    return this.http.patch<LinkI>(`${environment.apiUrl}/update/status/client/${clientId}`, {statusApplication: statusApplication});
  }

}
