import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../environment";
import {ClientI} from "./ClientI";
import {HttpClient} from "@angular/common/http";
import {ProfileI} from "../Profile";
import {ProfileInformation, ProfileInformationI} from "../ProfileInformation/ProfileInformationI";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) {
  }

  createConnection(coachId: string, message: string): Observable<ClientI> {
    return this.http.post<ClientI>(`${environment.apiUrl}/connect/${coachId}`, {message: message});
  }

  getClientConnection(): Observable<{age: number, price: number,
                                     fullName: string, description: string,
                                     statusApplication: string, rating: number, awsLink: string }> {
    return this.http.get<{age: number, price: number,
                          fullName: string, description: string,
                          statusApplication: string, rating: number, awsLink: string }>(`${environment.apiUrl}/application/client`);
  }

  deleteConnection(): Observable<ClientI> {
    return this.http.delete<ClientI>(`${environment.apiUrl}/delete/connection`);
  }


}
