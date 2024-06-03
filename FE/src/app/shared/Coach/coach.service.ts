import {Injectable} from "@angular/core";
import {Coach, CoachI} from "./CoachI";
import {environment} from "../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CoachService {

  constructor(private http: HttpClient) {}

  getClietsByCoach():Observable<CoachI[]>{
    return this.http.get<CoachI[]>(`${environment.apiUrl}/clients`);
  }
}
