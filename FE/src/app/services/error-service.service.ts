import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {User, UserI} from "../shared/User/UserI";

@Injectable({
  providedIn: 'root'
})
export class ErrorServiceService {

  constructor() { }

  errorSubject = new BehaviorSubject<string|null>(null);
  error$: Observable<string | null> = this.errorSubject.asObservable();
}
