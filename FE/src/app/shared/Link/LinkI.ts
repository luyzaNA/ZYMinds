export interface LinkI {
  clientId: string;
  coachId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  awsLink: string;
}

export class Link implements LinkI {
  clientId: string;
  coachId: string;
  status: 'pending' | 'approved' | 'rejected';
  message:string;
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  awsLink: string;

  constructor() {
    this.clientId = '';
    this.coachId = '';
    this.status = 'pending';
    this.message = '';
    this.id = '';
    this.fullName = '';
    this.email = '';
    this.phoneNumber = '';
    this.awsLink = '';
  }
}
