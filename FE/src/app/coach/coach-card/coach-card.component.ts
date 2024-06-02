import {Component, Input} from '@angular/core';
import {User, UserInformation} from "../../shared/user";
import {AuthService} from "../../services/auth.service";
import {ClientService} from "../../shared/Client/client.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-coach-card',
  templateUrl: './coach-card.component.html',
  styleUrls: ['./coach-card.component.css']
})
export class CoachCardComponent {
  currentUser!: User;
  showApplyBox = false;
  messageToCoach ='';
  isTextareaVisible: boolean = false;
  isApplyButtonVisible: boolean= true

  @Input() userProfileInformation!: UserInformation;

  constructor(private clientService: ClientService,
              protected authService: AuthService,
              private router: Router) {
    this.currentUser = this.authService.getCurrentUser();
  }

  openForm(): void {
    this.isTextareaVisible = true;
    this.isApplyButtonVisible = false;
  }

  closeForm(): void {
    this.isTextareaVisible = false;
    this.isApplyButtonVisible = true;
  }

  applApplyForCoaching(coachId: string): void {
    this.showApplyBox = true
    this.clientService.createConnection(coachId, this.messageToCoach).subscribe(
      (response) => {
        alert("Felicitari!Ai aplicat cu succes");
        this.router.navigate(['../', 'client', 'dashboard']);
      },
      (error) => {
        console.error('Eroare la crearea conexiunii:', error);
      }
    );
  }
}
