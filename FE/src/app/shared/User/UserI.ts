export interface UserI {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string | null;
  newCoach: boolean;
  roles: string;
  id: string;
}

export class User implements UserI{
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string | null;
  newCoach: boolean;
  roles: string;
  id: string;

  constructor() {
    this.email = '';
    this.fullName = '';
    this.phoneNumber = '';
    this.password = '';
    this.newCoach = false;
    this.roles = '';
    this.id = '';
  }
}
