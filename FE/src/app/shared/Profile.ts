export interface ProfileI{
  _id: string;
  age: number;
  description: string;
  price: number;
  rating: number;
  userId: string;
  awsLink: string;
}

export class Profile implements ProfileI {
  _id: string;
  age: number;
  description: string;
  price: number;
  rating: number;
  userId: string;
  awsLink: string;
  constructor() {
    this._id = '';
    this.age = 0;
    this.description = '';
    this.price = 0;
    this.rating = 0;
    this.userId = '';
    this.awsLink = '';
  }
}
