export interface MenuI {
  linkId: string;
  daily_intake: {
    protein: number,
    fat: number,
    carbs: number,
    kcalsPerMainMeal: number,
    kcalsPerSecondaryMeal: number
  },
  meals: [],
  status: string
}

export class Menu implements MenuI{
  linkId: string;
  daily_intake: {
    protein: number,
    fat: number,
    carbs: number,
    kcalsPerMainMeal: number,
    kcalsPerSecondaryMeal: number
  };
  meals: [];
  status: string;

  constructor() {
    this.linkId = '';
    this.daily_intake = {
      protein: 0,
      fat: 0,
      carbs: 0,
      kcalsPerMainMeal: 0,
      kcalsPerSecondaryMeal: 0
    };
    this.meals = [];
    this.status = '';
  }
}
