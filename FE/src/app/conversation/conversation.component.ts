import {Component, OnDestroy} from '@angular/core';
import {UserService} from "../shared/User/user.service";
import {ConversationService} from "../shared/Conversation/conversation.service";
import {Conversation, ConversationI} from "../shared/Conversation/ConversationI";
import {AuthService} from "../services/auth.service";
import {User} from "../shared/User/UserI";

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnDestroy {

  searchEmail: string = '';
  timer: any;
  users: User[] = new Array<User>();
  conversation: ConversationI[] = new Array<Conversation>();
  messages: Conversation[] = new Array<Conversation>();
  firstMessage: string = '';
  selectedUserEmail: string = '';
  viewInput: boolean = false;
  messageText = '';
  conversationId = ''

  currentUser: User = new User();

  constructor(private userService: UserService,
              private conversationService: ConversationService,
              private auth: AuthService) {
    this.auth.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
    this.getAllConversations();
  }

  getAllConversations(): void {
    this.conversationService.getConversations().subscribe((conversations: ConversationI[]) => {
      this.conversation = conversations;
    });
  }

  searchUsers() {
    clearInterval(this.timer)
    if (this.searchEmail.length >= 2) {
      this.userService.searchUsersByEmail(this.searchEmail)
        .subscribe(users => {
          this.users = users;
        }, error => {
          this.users = [];
        });
    } else {
      this.users = [];
    }
  }

  closeSearchResults() {
    this.users = [];
    this.searchEmail = '';
  }

  checkConversation(user: User) {
    this.selectedUserEmail = user.email;
    const existingConversation = this.conversation.find(conversation => conversation.otherParticipantEmail === user.email);
    if (existingConversation) {
      this.selectConversation(existingConversation);
      this.viewInput = false
    } else {
      this.viewInput = true;
    }
  }

  selectConversation(conversation: Conversation) {
    this.viewInput = false;
    this.conversationId = conversation.id;
    clearInterval(this.timer)
    this.pullMessages(conversation.otherParticipantEmail);
  }

  pullMessages(email: string) {
    this.timer = setInterval(() => {
      this.getMessages(email);
      this.closeSearchResults()
    }, 1000);
  }

  getMessages(email: string) {
    this.selectedUserEmail = email;
    this.conversationService.getMessagesByEmail(email).subscribe((mess: Conversation[]) => {
      this.messages = mess;
    }, err => {
      console.log(err);
    })
  }

  sendMessages(message: string) {
    this.viewInput = false;
    console.log("HEEEI", this.conversationId);
    this.conversationService.sendMessage(this.conversationId, message).subscribe((conversations: ConversationI) => {
        this.getMessages(this.selectedUserEmail);
        this.getAllConversations();
      },
      error => console.log(error));
    this.messageText = ''
  }

  startConversation(firstMessage: string) {
    if (firstMessage.trim().length > 0) {
      clearInterval(this.timer)
      this.conversationService.initializeConversation(this.selectedUserEmail, firstMessage).subscribe((conversation: ConversationI) => {
          if (conversation) {
            this.pullMessages(this.selectedUserEmail)
            this.getMessages(this.selectedUserEmail);
            this.getAllConversations()
            this.viewInput = false;
          }
        },
        error => {
        this.selectedUserEmail = '';
        this.viewInput = false;
        console.log(error)});
    } else {
      alert('Message content is empty. Please provide a valid message.');
    }
  }


  ngOnDestroy() {
    clearInterval(this.timer);
  }
}


