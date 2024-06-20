export interface PrerequisitesI {
  age: number;
  weight: number;
  height: number;
  gender: string;
  target: 'LOSE WEIGHT' | 'GAIN WEIGHT';
  intolerances: string[]
  linkId: string;
  id: string;
  activityLevel: string;
}

export class Prerequisites implements PrerequisitesI {
  age: number;
  weight: number;
  height: number;
  gender: string;
  target:'LOSE WEIGHT' | 'GAIN WEIGHT';
  intolerances: string[];
  linkId: string;
  id: string;
  activityLevel: string;

  constructor() {
    this.age = 0;
    this.weight = 0;
    this.height = 0;
    this.gender = '';
    this.target = 'GAIN WEIGHT';
    this.intolerances = [];
    this.linkId = '';
    this.id = '';
    this.activityLevel = '';
  }
}
