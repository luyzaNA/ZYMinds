import {Component, Input} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {LinkService} from "../../shared/Link/link.service";
import {Router} from "@angular/router";
import {ProfileInformation} from "../../shared/ProfileInformation/ProfileInformationI";
import {User} from "../../shared/User/UserI";

@Component({
  selector: 'app-coach-card',
  templateUrl: './coach-card.component.html',
  styleUrls: ['./coach-card.component.css']
})
export class CoachCardComponent {
  currentUser: User = new User();
  showApplyBox = false;
  messageToCoach = '';
  isTextareaVisible: boolean = false;
  isApplyButtonVisible: boolean = true

  @Input() userProfileInformation!: ProfileInformation;
  @Input() applied: boolean = false;
  @Input() evaluateCoach: boolean = false;

  constructor(private clientService: LinkService,
              protected authService: AuthService,
              private router: Router) {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  openForm(): void {
    if (!this.currentUser.id) {
      this.router.navigate(['../', 'login']);
    } else if (this.currentUser.roles !== 'CLIENT') {
      alert("TREBUIE SA AI ROL DE CLIENT PT A PUTEA APLICA")
    } else {
      this.isTextareaVisible = true;
      this.isApplyButtonVisible = false;
    }
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
