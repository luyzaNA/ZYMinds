import {Component} from '@angular/core';
import {UserService} from "../services/user.service";
import {User} from "../shared/user";

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent {
  searchText: string = '';
  users: User[] = [];
  isLoading: boolean = false;

  constructor(private userService: UserService) {
  }

  searchUsers() {
    if (this.searchText.length >= 2) {
      this.isLoading = true;
      this.userService.searchUsersByEmail(this.searchText)
        .subscribe(users => {
          this.users = users;
          this.isLoading = false;
        }, error => {
          this.users = [];
          this.isLoading = false;
        });
    } else {
      this.users = [];
    }
  }
}
