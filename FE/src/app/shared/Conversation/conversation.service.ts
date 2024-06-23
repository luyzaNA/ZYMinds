import { Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../environment";
import {catchError, Observable} from "rxjs";
import {Conversation, ConversationI} from "./ConversationI";
import {map} from "rxjs/operators";
import {ErrorServiceService} from "../../services/error-service.service";

@Injectable({
  providedIn: 'root'
})

export class ConversationService {

  constructor(private http: HttpClient, private errorService: ErrorServiceService) {}

    getConversations(): Observable<ConversationI[]> {
    return this.http.get<ConversationI[]>(`${environment.apiUrl}/conversations`);
  }

    sendMessage(conversationId: string, content: string): Observable<ConversationI> {
      return this.http.post<ConversationI>(`${environment.apiUrl}/message/${conversationId}`, { content: content});
    }

    initializeConversation(email:string, content:string): Observable<ConversationI>{
    return this.http.post<ConversationI>(`${environment.apiUrl}/initialize/conversation`, { email: email, content: content}).pipe(
      map(response => response),
      catchError(error => {
        this.errorService.errorSubject.next(error.error.message)
        throw error;
      })
    );
    }

    getMessagesByEmail(email:string): Observable<ConversationI[]>{
    return this.http.get<ConversationI[]>(`${environment.apiUrl}/messagesByEmail/${email}`);
    }
}
