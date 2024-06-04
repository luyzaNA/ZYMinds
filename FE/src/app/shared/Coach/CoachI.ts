export interface CoachI {
  fullName: string;
  email: string;
  phoneNumber: string;
  age: number;
  awsLink: string;
  status: string;
  message: string;
  clientId: string;
}

export class Coach implements CoachI {
  fullName: string;
  email: string;
  phoneNumber: string;
  age: number;
  awsLink: string;
  status: string;
  message: string;
  clientId: string

  constructor() {
    this.fullName =
    this.email = '';
    this.phoneNumber = '';
    this.age = 0;
    this.awsLink = '';
    this.status = '';
    this.message = '';
    this.clientId = '';
  }

}
