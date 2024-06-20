import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Prerequisites, PrerequisitesI} from "./PrerequisitesI";
import {Observable} from "rxjs";
import {LinkI} from "../Link/LinkI";
import {environment} from "../environment";

@Injectable({
  providedIn: 'root'
})


export class PrerequisitesService {
  constructor(private http:HttpClient) {
  }
// Create Prerequisites
  createPrerequisites(data: Prerequisites): Observable<Prerequisites> {
    return this.http.post<Prerequisites>(`${environment.apiUrl}/create/prerequisites`, data);
  }

  // Get Prerequisites by Link ID
  getPrerequisitesByLink(linkId: string): Observable<Prerequisites> {
    return this.http.get<Prerequisites>(`${environment.apiUrl}/prerequisites/${linkId}`);
  }

  // Update Prerequisites by ID
  updatePrerequisites(id: string, data: Prerequisites): Observable<Prerequisites> {
    return this.http.put<Prerequisites>(`${environment.apiUrl}/update/prerequisites/${id}`, data);
  }

}
