import {Component, EventEmitter, Output} from '@angular/core';
import {CoachCardService} from "../../services/coach-card.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-create-coach-card',
  templateUrl: './create-coach-card.component.html',
  styleUrls: ['./create-coach-card.component.css']
})
export class CreateCoachCardComponent {
   currentUser: any;


  constructor(protected coachCardService: CoachCardService, private  auth : AuthService)  {
      const storedUser = localStorage.getItem('currentUser');
      this.currentUser = storedUser ? JSON.parse(storedUser) : null;
      if (this.currentUser) {
        this.coachCardService.coachData.fullName = this.currentUser.fullName;
        this.updateFullName(this.coachCardService.coachData.fullName);
      }
  }

  updateFullName(value: string): void {
    this.coachCardService.coachData.fullName = value;
  }

  updateImg(event: any){
    let fileReader = new FileReader();
    fileReader.onloadend = (e: any) => {
      this.coachCardService.coachData.img = e.target.result;
    }
    fileReader.readAsDataURL(event[0]);
  }

  updateAge(value: number): void {
    this.coachCardService.coachData.age = value;
  }

  updateDescription(value: string): void {
    this.coachCardService.coachData.description = value;
  }
}

