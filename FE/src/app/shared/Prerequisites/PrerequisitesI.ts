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
  mainMealsCount: number;
  secondaryMealsCount: number;
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
  mainMealsCount: number;
  secondaryMealsCount: number;

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
    this.mainMealsCount = 0;
    this.secondaryMealsCount = 0;
  }
}
