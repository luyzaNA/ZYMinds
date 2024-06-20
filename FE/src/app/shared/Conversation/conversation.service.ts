import { Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../environment";
import {Observable} from "rxjs";
import {ConversationI} from "./ConversationI";

@Injectable({
  providedIn: 'root'
})

export class ConversationService {

  constructor(private http: HttpClient) {}

    getConversations(): Observable<ConversationI[]> {
    return this.http.get<ConversationI[]>(`${environment.apiUrl}/conversations`);
  }


    sendMessage(conversationId: string, content: string): Observable<ConversationI> {
      return this.http.post<ConversationI>(`${environment.apiUrl}/message/${conversationId}`, { content: content});
    }

    initializeConversation(email:string, content:string): Observable<ConversationI>{
    return this.http.post<ConversationI>(`${environment.apiUrl}/initialize/conversation`, { email: email, content: content});
    }

    getConversationByEmail(email:string): Observable<string>{
    return this.http.get<string>(`${environment.apiUrl}/conversation/${email}`);
    }

    getMessagesByEmail(email:string): Observable<ConversationI[]>{
    return this.http.get<ConversationI[]>(`${environment.apiUrl}/messagesByEmail/${email}`);
    }

}
