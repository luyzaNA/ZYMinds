
export interface User {
  email: string;
  fullName: string;
  phoneNumber: number;
  password: string | null;
  newCoach: boolean;
  roles: string;
  id: string;
}
