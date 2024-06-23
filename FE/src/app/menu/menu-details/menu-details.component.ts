import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MenuService} from "../../services/menu-service.service";
import {Menu, MenuI} from "../../shared/Menu/MenuI";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-menu-details',
  templateUrl: './menu-details.component.html',
  styleUrls: ['./menu-details.component.css']
})
export class MenuDetailsComponent implements OnInit, OnDestroy {
  inProgress: boolean = false;
  linkId!: string;
  menu!: MenuI;
  timer!: any;

  collapsedDaysState: boolean[] = [];
  collapsedIngredientsState: boolean[] = [];
  edited: boolean = false;
  noMenu: boolean = false;
  menuGenerated: boolean = false;
  menuCompleted: boolean = false;
  modifyIngredient: boolean = false;
  modifiedIngredient: any = {name: 'empty'};
  private dayIndex: number = -1;
  private mealIndex: number = -1;
  private ingredientIndex: number = -1;
  foods: any[] = [];
  isCoach: boolean = false;

  constructor(private menuService: MenuService, private route: ActivatedRoute, private authService: AuthService) {
    this.linkId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.menuService.getFoods().subscribe(() => {
    });
    this.menuService.foods$.subscribe((foods) => {
      this.foods = foods;
    });
    this.timer = setInterval(() => {
      this.menuService.getMenu(this.linkId).subscribe(() => {
      });
    }, 1000);

    this.menuService.menu$.subscribe((menu) => {
      if (!menu) {
        this.inProgress = true;
        this.authService.currentUser$.subscribe(user => {
          if (user.roles === 'COACH') {
            this.noMenu = true;
            this.inProgress = false;
            clearInterval(this.timer);
          }
        });
        return;
      }
      if (menu.status === 'GENERATED' || menu.status === 'COMPLETED') {
        clearInterval(this.timer);
        this.inProgress = false;
        this.noMenu = false;
        this.menuGenerated = true;

        this.authService.currentUser$.subscribe(user => {
          if (menu.status === 'GENERATED') {
            if (user.roles === 'CLIENT') {
              this.noMenu = true;
              this.inProgress = true;
              this.menuGenerated = false;
            }
          } else {
            if (user.roles === 'COACH') {
              this.isCoach = true;
            }
          }
        });

        this.menu = menu
        console.log(this.menu)
        this.menu.meals.forEach((day: any) => {
          this.collapsedDaysState.push(true);
          if (day) {
            day.forEach((meal: any) => {
              meal.ingredients.forEach(() => {
                this.collapsedIngredientsState.push(true);
              });
            });
          }
        });
        if (menu.status === 'COMPLETED') {
          this.menuCompleted = true;
        }
      } else if (menu.status === 'PROCESSING') {
        this.inProgress = true;
        this.noMenu = false;
      } else {
        this.noMenu = true;
        this.menu = new Menu();
        this.menuGenerated = false;
      }
      this.edited = false;
    });
  }

  toggleCollapse(collapsedDaysState: boolean[], dayIndex: number) {
    collapsedDaysState[dayIndex] = !collapsedDaysState[dayIndex];
  }

  saveEditing() {
    this.menuService.updateMenu(this.linkId, this.menu).subscribe(() => {
    });
    this.edited = false;
  }

  delete() {
    window.event?.preventDefault();
    this.menuService.deleteMenu(this.linkId).subscribe(() => {
    });
  }

  closeEditing() {
    this.timer = setInterval(() => {
      this.menuService.getMenu(this.linkId).subscribe(() => {
      });
    }, 1000);
    this.edited = false;
    this.modifyIngredient = false;
  }

  generateMenu() {
    this.menuService.generateMenu(this.linkId).subscribe(() => {
    });
    this.timer = setInterval(() => {
      this.menuService.getMenu(this.linkId).subscribe(() => {
      });
    }, 1000);
  }

  sendMenuToClient() {
    this.menuService.sendMenuToUser(this.linkId).subscribe(() => {
    });
    this.timer = setInterval(() => {
      this.menuService.getMenu(this.linkId).subscribe(() => {
      });
    }, 1000);
  }

  deleteIngredient(dayIndex: number, mealIndex: number, ingredientIndex: number) {
    this.edited = true;
    const updatedIngredients = [
      // @ts-ignore
      ...this.menu.meals[dayIndex][mealIndex].ingredients.slice(0, ingredientIndex),
      // @ts-ignore
      ...this.menu.meals[dayIndex][mealIndex].ingredients.slice(ingredientIndex + 1)
    ];

    // @ts-ignore
    this.menu.meals[dayIndex][mealIndex].ingredients = updatedIngredients;
    this.recalculateDailyIntake();
  }

  recalculateDailyIntake() {
    let protein = 0;
    let fat = 0;
    let carbs = 0;
    // @ts-ignore
    this.menu.meals.forEach((day: any) => {
      // @ts-ignore
      day.forEach((meal: any) => {
        // @ts-ignore
        meal.ingredients.forEach((ingredient: any) => {
          protein += ingredient.proteins;
          fat += ingredient.lipids;
          carbs += ingredient.carbohydrates;
        });
      });
    });
    // @ts-ignore
    this.menu.daily_intake.protein = protein / this.menu.meals.length;
    // @ts-ignore
    this.menu.daily_intake.fat = fat / this.menu.meals.length;
    // @ts-ignore
    this.menu.daily_intake.carbs = carbs / this.menu.meals.length;
  }

  editIngredient(dayIndex: number, mealIndex: number, ingredientIndex: number) {
    this.dayIndex = dayIndex;
    this.mealIndex = mealIndex;
    this.ingredientIndex = ingredientIndex;
    this.modifyIngredient = true;
    // @ts-ignore
    this.modifiedIngredient = this.menu.meals[dayIndex][mealIndex].ingredients[ingredientIndex];
  }

  modifyQuantity($event: number) {
    const originalQuantity = this.modifiedIngredient.name.split(" ")[0];
    const diff = $event - originalQuantity;
    const multiplier = diff / originalQuantity;

    this.modifiedIngredient.name = $event + ' ' + this.modifiedIngredient.name.split(" ").slice(1).join(" ");
    this.modifiedIngredient.proteins += this.modifiedIngredient.proteins * multiplier;
    this.modifiedIngredient.lipids += this.modifiedIngredient.lipids * multiplier;
    this.modifiedIngredient.carbohydrates += this.modifiedIngredient.carbohydrates * multiplier;
    this.modifiedIngredient.kcals += this.modifiedIngredient.kcals * multiplier;
    this.modifiedIngredient.magnesium += this.modifiedIngredient.magnesium * multiplier;
    this.modifiedIngredient.calcium += this.modifiedIngredient.calcium * multiplier;
    this.modifiedIngredient.iron += this.modifiedIngredient.iron * multiplier;
    this.modifiedIngredient.sodium += this.modifiedIngredient.sodium * multiplier;
    this.modifiedIngredient.potassium += this.modifiedIngredient.potassium * multiplier;
    this.modifiedIngredient.phosphorus += this.modifiedIngredient.phosphorus * multiplier;
    this.modifiedIngredient.vitamin_A += this.modifiedIngredient.vitamin_A * multiplier;
    this.modifiedIngredient.vitamin_C += this.modifiedIngredient.vitamin_C * multiplier;
    this.modifiedIngredient.vitamin_D += this.modifiedIngredient.vitamin_D * multiplier;
    this.modifiedIngredient.vitamin_E += this.modifiedIngredient.vitamin_E * multiplier;
    this.modifiedIngredient.vitamin_K += this.modifiedIngredient.vitamin_K * multiplier;
    this.modifiedIngredient.vitamin_B6 += this.modifiedIngredient.vitamin_B6 * multiplier;
    this.modifiedIngredient.vitamin_B12 += this.modifiedIngredient.vitamin_B12 * multiplier;
    this.modifiedIngredient.fiber += this.modifiedIngredient.fiber * multiplier;
    this.modifiedIngredient.sugar += this.modifiedIngredient.sugar * multiplier;
    this.modifiedIngredient.thiamin += this.modifiedIngredient.thiamin * multiplier;
    this.modifiedIngredient.riboflavin += this.modifiedIngredient.riboflavin * multiplier;
    this.modifiedIngredient.niacin += this.modifiedIngredient.niacin * multiplier;
  }

  saveModifiedIngredient() {
    //@ts-ignore
    this.menu.meals[this.dayIndex][this.mealIndex].ingredients[this.ingredientIndex] = this.modifiedIngredient;
    this.recalculateDailyIntake();
    this.modifyIngredient = false;
    this.edited = true;
  }

  addIngredient($event: any, dayIndex: number, mealIndex: number) {
    let ingredient = $event;
    ingredient.name = this.formatIngredientName(ingredient.name);
    // @ts-ignore
    this.menu.meals[dayIndex][mealIndex].ingredients.push($event);
    this.edited = true;
    this.recalculateDailyIntake()
  }

  formatIngredientName(name: string) {
    return name.replace(/(\d+)([a-zA-Z]+)/, '$1 $2');
  }

  getIngredientName(name: string) {
    let regex = /\d+\s*(g|ml|kg|l)\s*(.*)/i;

    let match = name.match(regex);

    if (match) {
      let result = match[2].trim();
      return result.charAt(0).toUpperCase() + result.slice(1);
    } else {
      return "No match found";
    }
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
