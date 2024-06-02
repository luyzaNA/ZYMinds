import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../environment";
import {ClientI} from "./ClientI";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) {
  }

  createConnection(coachId: string, message:string): Observable<ClientI>{
    return this.http.post<ClientI>(`${environment.apiUrl}/connect/${coachId}`, {message: message});
  }
}
