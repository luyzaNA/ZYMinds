export interface ProfileInformationI {
  email: string;
  fullName: string;
  phoneNumber: string;
  description: string;
  age: number;
  price: number;
  userId: string;
  rating: number;
  awsLink: string;
  id: string;
  statusApplication: string;
}

export class ProfileInformation implements ProfileInformation {
  email: string;
  fullName: string;
  phoneNumber: string;
  description: string;
  age: number;
  price: number;
  userId: string;
  rating: number;
  awsLink: string;
  id: string;
  statusApplication: string;

  constructor() {
    this.email = '';
    this.fullName = '';
    this.phoneNumber = '';
    this.description = '';
    this.age = 0;
    this.price = 0;
    this.userId = '';
    this.rating = 0;
    this.awsLink = '';
    this.id = '';
    this.statusApplication = '';
  }
}

