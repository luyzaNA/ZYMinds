export interface CoachI {
  fullName: string;
  email: string;
  phoneNumber: string;
  age: number;
  awsLink: string;
}

export class Coach implements CoachI {
  fullName: string;
  email: string;
  phoneNumber: string;
  age: number;
  awsLink: string;

  constructor() {
    this.fullName = '';
    this.email = '';
    this.phoneNumber = '';
    this.age = 0;
    this.awsLink = '';
  }
}
