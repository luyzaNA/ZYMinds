export interface ClientI{
  userId: string;
  coachId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
}

export class Client implements ClientI {
  userId: string;
  coachId: string;
  status: 'pending' | 'approved' | 'rejected';
  message:string;

  constructor() {
    this.userId = '';
    this.coachId = '';
    this.status = 'pending';
    this.message = '';
  }
}
