export interface LinkI {
  clientId: string;
  coachId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  id: string;
}

export class Link implements LinkI {
  clientId: string;
  coachId: string;
  status: 'pending' | 'approved' | 'rejected';
  message:string;
  id: string;

  constructor() {
    this.clientId = '';
    this.coachId = '';
    this.status = 'pending';
    this.message = '';
    this.id = '';
  }
}
