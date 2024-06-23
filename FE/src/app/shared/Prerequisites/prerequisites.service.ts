import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Prerequisites, PrerequisitesI} from "./PrerequisitesI";
import {catchError, Observable} from "rxjs";
import {environment} from "../environment";
import {map} from "rxjs/operators";
import {ErrorServiceService} from "../../services/error-service.service";

@Injectable({
  providedIn: 'root'
})


export class PrerequisitesService {
  constructor(private http:HttpClient, private errorService: ErrorServiceService) {
  }

  createPrerequisites(data: Prerequisites): Observable<PrerequisitesI> {
    return this.http.post<PrerequisitesI>(`${environment.apiUrl}/create/prerequisites`, data);
  }

  getPrerequisitesByLink(linkId: string): Observable<PrerequisitesI> {
    return this.http.get<PrerequisitesI>(`${environment.apiUrl}/prerequisites/${linkId}`).pipe(
      map(response => response),
      catchError(error => {
        throw error;
      })
    );
  }

  updatePrerequisites(id: string, data: PrerequisitesI): Observable<PrerequisitesI> {
    return this.http.put<PrerequisitesI>(`${environment.apiUrl}/update/prerequisites/${id}`, data);
  }
}
