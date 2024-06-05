export interface ConversationI {
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
  lastMessageContent: string;
  otherParticipantEmail: string;
  id: string;
  senderEmail: string;
  receiverName: string;
  conversationId:string
}

export class Conversation implements ConversationI {
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
  lastMessageContent: string;
  otherParticipantEmail :string;
  id: string;
  senderEmail: string;
  receiverName: string;
  conversationId:string;

  constructor() {
    this.sender = '';
    this.receiver = '';
    this.content = '';
    this.createdAt = '';
    this.lastMessageContent = '';
    this.otherParticipantEmail = '';
    this.id = '';
    this.senderEmail = '';
    this.receiverName = '';
    this.conversationId = '';
  }
}
