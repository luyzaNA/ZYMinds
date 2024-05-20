import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoachCardService {
  coachData = {
    fullName: '',
    age: 0,
    description: '',
    img: ''
  };

  constructor() { }
}
