import { Injectable } from '@angular/core';
import {environment} from "../shared/environment";
import {User, UserI} from "../shared/User/UserI";
import {BehaviorSubject, catchError, Observable, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {map} from "rxjs/operators";
import {Menu, MenuI} from "../shared/Menu/MenuI";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {ErrorServiceService} from "./error-service.service";

@Injectable({
  providedIn: 'root'
})
export class MenuServiceService {

  private baseUrl = environment.apiUrl;
  menuSubject = new BehaviorSubject<Menu>(new Menu());
  menu$: Observable<MenuI> = this.menuSubject.asObservable();

  foodsSubject = new BehaviorSubject<[]>([]);
  foods$: Observable<[]> = this.foodsSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private errorService: ErrorServiceService ) {

  }

  getMenu(linkId: string): Observable<void> {
    return this.http.get<any>(`${this.baseUrl}/menu/${linkId}`).pipe(map(response => {
      this.menuSubject.next(response);
    }),
      catchError(error => {
        this.errorService.errorSubject.next(error.error.message);
        return throwError(error);
      }));
  }

  deleteMenu(linkId: string): Observable<void> {
    return this.http.delete<any>(`${this.baseUrl}/menu/${linkId}`).pipe(map(response => {
        this.menuSubject.next(new Menu());
      }),
      catchError(error => {
        this.errorService.errorSubject.next(error.error.message);
        return throwError(error);
      }));
  }

  generateMenu(linkId: string): Observable<void> {
    return this.http.post<any>(`${this.baseUrl}/menu/${linkId}`,{}).pipe(map(response => {
        this.menuSubject.next(response);
      }),
      catchError(error => {
        this.errorService.errorSubject.next(error.error.message);
        return throwError(error);
      }));
  }

  sendMenuToUser(linkId: string): Observable<void> {
    return this.http.put<any>(`${this.baseUrl}/menu/${linkId}`,{status: "COMPLETED"}).pipe(map(response => {
        this.menuSubject.next(response);
      }),
      catchError(error => {
        this.errorService.errorSubject.next(error.error.message);
        return throwError(error);
      }));
  }

  getFoods(): Observable<void> {
    return this.http.get<any>(`${this.baseUrl}/foods`).pipe(map(response => {
        this.foodsSubject.next(response);
      }),
      catchError(error => {
        this.errorService.errorSubject.next(error.error.message);
        return throwError(error);
      }));
  }

  updateMenu(linkId: string, menu: MenuI): Observable<void> {
    return this.http.put<any>(`${this.baseUrl}/menu/${linkId}`, {...menu}).pipe(map(response => {
        this.menuSubject.next(response);
      }),
      catchError(error => {
        this.errorService.errorSubject.next(error.error.message);
        return throwError(error);
      }));
  }
}
