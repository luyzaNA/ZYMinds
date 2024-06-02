export interface ClientI{
  clientId: string;
  coachId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
}

export class Client implements ClientI {
  clientId: string;
  coachId: string;
  status: 'pending' | 'approved' | 'rejected';
  message:string;

  constructor() {
    this.clientId = '';
    this.coachId = '';
    this.status = 'pending';
    this.message = '';
  }
}
