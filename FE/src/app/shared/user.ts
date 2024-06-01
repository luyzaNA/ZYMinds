
export interface User {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string | null;
  newCoach: boolean;
  roles: string;
  id: string;
}



export interface UserInformation {
  email: string;
  fullName: string;
  phoneNumber: string;
  description: string ;
  age: number;
  price: number;
  userId: string;
  rating: number;
  photoUrl: string;
}


