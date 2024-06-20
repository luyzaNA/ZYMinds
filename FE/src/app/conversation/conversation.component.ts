import {Component} from '@angular/core';
import {UserService} from "../shared/User/user.service";
import {ConversationService} from "../shared/Conversation/conversation.service";
import {Conversation, ConversationI} from "../shared/Conversation/ConversationI";
import {AuthService} from "../services/auth.service";
import {FileUploadService} from "../services/upload.service";
import {User} from "../shared/User/UserI";

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent {
  //folosit pt a stoca email ul cautat
  searchEmail: string = '';

  //stocheaza toti userii gasiti
  users: User[] = new Array<User>();


  //conversatiile cu un user cu  email, data ultimului mesaj + continut
  conversation: ConversationI[] = new Array<Conversation>();


  //mesajale cu un user cu email dat, data  fiecarui mesaj + continut
  messages: Conversation[] = new Array<Conversation>();

  //mesajul care se trimite la initierea unui conversatii
  firstMessage: string = '';

  //folosit dupa ce a fost selectat pentru a face cereri catre db
  selectedUserEmail: string = '';

  //folosit pentru a afisasa/ascunde rezulatul search ului
  viewInput: boolean = false;

  //folosit pt a stoca mesajul trimit
  messageText = '';

  ///folosit pt a stoca id ul converstiei selectate, pt a putea trimite mesaje
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

  //pe pagina sunt mereu incarcate conversatiile
  getAllConversations(): void {
    this.conversationService.getConversations().subscribe((conversations: ConversationI[]) => {
      this.conversation = conversations;
    });
  }

  // apelat cand se inchide fereastra cu rezultatele search ului
  closeSearchResults() {
    this.users = [];
    this.searchEmail = '';
  }

  //verifica daca exista o conversatie
  //daca exista se selecteaza conversatia
  //nu se afiseaza sectiunea de initiere
  //dca nu exista se afiseaza sectiunea de initiere
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

  //se salveaza id ul conversatiei selectate pt a se putea trimite msg
  //se incarca mesajele conversatiei
  selectConversation(conversation: Conversation) {
    this.viewInput = false;
    this.conversationId = conversation.id;
    this.getMessages(conversation.otherParticipantEmail);
    this.closeSearchResults()
  }

  //returneaza lista cu toate mesajele +data + cine le a trimis in functie de mail ul selectat
  getMessages(email: string) {
    this.selectedUserEmail = email;
    this.conversationService.getMessagesByEmail(email).subscribe((mess: Conversation[]) => {
      this.messages = mess;
    }, err => {
      console.log(err);
    })
  }

//se trimit mesajele
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

  //se incepe o conversatie cu email ul setat dupa verificare daca exista sau nu o conversatie
  //se trimite mesajul din input ca parametru
  //se incarca conversatia nou inceputa cu mesaju
  //se reincarca toate conversatiile
  startConversation(firstMessage: string) {
    if (firstMessage.trim().length > 0) {
      this.conversationService.initializeConversation(this.selectedUserEmail, firstMessage).subscribe((conversations: ConversationI) => {
          this.viewInput = false;
          this.getMessages(this.selectedUserEmail);
          this.getAllConversations()
        },
        error => console.log(error));
    } else {
      alert('Message content is empty. Please provide a valid message.');
    }
  }


//cautarea email ului dupa valoarea din input
  //cautarea incepe dupa ce se introduc 2 caractere
  searchUsers() {
    if (this.searchEmail.length >= 2) {
      this.userService.searchUsersByEmail(this.searchEmail)
        .subscribe(users => {
          this.users = users;
        }, error => {
          alert("Users not found")
          this.users = [];
          this.closeSearchResults()
        });
    } else {
      this.users = [];
    }
  }
}
