export interface ClientI{
  userId: string;
  coachId: string;
  status: 'pending' | 'approved' | 'rejected';
}

export class Client implements ClientI {
  userId: string;
  coachId: string;
  status: 'pending' | 'approved' | 'rejected';

  constructor() {
    this.userId = '';
    this.coachId = '';
    this.status = 'pending';
  }
}
