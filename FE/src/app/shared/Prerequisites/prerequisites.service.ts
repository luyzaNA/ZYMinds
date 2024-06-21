import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Prerequisites, PrerequisitesI} from "./PrerequisitesI";
import {catchError, Observable} from "rxjs";
import {LinkI} from "../Link/LinkI";
import {environment} from "../environment";
import {map} from "rxjs/operators";
import {ErrorServiceService} from "../../services/error-service.service";

@Injectable({
  providedIn: 'root'
})


export class PrerequisitesService {
  constructor(private http:HttpClient, private errorService: ErrorServiceService) {
  }
// Create Prerequisites
  createPrerequisites(data: Prerequisites): Observable<Prerequisites> {
    return this.http.post<Prerequisites>(`${environment.apiUrl}/create/prerequisites`, data);
  }

  // Get Prerequisites by Link ID
  getPrerequisitesByLink(linkId: string): Observable<Prerequisites> {
    return this.http.get<Prerequisites>(`${environment.apiUrl}/prerequisites/${linkId}`).pipe(
      map(response => response),
      catchError(error => {
        throw error;
      })
    );
  }

  // Update Prerequisites by ID
  updatePrerequisites(id: string, data: Prerequisites): Observable<Prerequisites> {
    return this.http.put<Prerequisites>(`${environment.apiUrl}/update/prerequisites/${id}`, data);
  }

}
