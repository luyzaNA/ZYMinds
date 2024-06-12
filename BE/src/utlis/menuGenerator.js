import NutritionCalculator from "./nutritionCalculator.js";
import Food from "../models/Food.js";

// const mealTypes = ["Lunch", "Dinner", "Breakfast", "Snack"];
//
// async function getRandomIngredientByMealType(mealType) {
//     const ingredient = await Food.aggregate([{$match: {mealType: mealType}}, {$sample: {size: 1}}]);
//     return ingredient[0];
// }
const menuGenerator = {
    async getRandomIngredientByType(type) {
        console.log("AJUNG IN RANDOM BY TYPE")
        const ingredientsCount = await Food.countDocuments({mealType: {$elemMatch: {$eq: type}}});
        console.log("Ingredients count for type", type, ingredientsCount);
        const randomIndex = NutritionCalculator.getRandomNumber(ingredientsCount - 1);
        const snack = await Food.find({mealType: {$elemMatch: {$eq: type}}}).limit(1).skip(randomIndex);
        return snack[0];
    },
    async getRandomIngredientByTypeAndCategory(type, category) {
        console.log("ajung aici")
        const ingredientsCount = await Food.countDocuments({mealType: {$elemMatch: {$eq: type}}, category: category});
        const randomIndex = NutritionCalculator.getRandomNumber(ingredientsCount - 1);
        console.log("Ingredients count", ingredientsCount)
        const ingredient = await Food.find({
            mealType: {$elemMatch: {$eq: type}}, category: category
        }).limit(1).skip(randomIndex);
        return ingredient[0];
    },

    async generateMenuForDays(prerequisites, kcalsPerMeal) {
        console.log("prerequisites si kcalsperMeal", prerequisites)
        const numberOfDays = 30;
        let menu = [];
        console.log("jjpjjjjojoj")

        for (let i = 0; i < numberOfDays; i++) {
            let dayMenu = [];

            for (let j = 0; j < prerequisites.secondaryMealsCount; j++) {
                console.log("MERG IN SECUNDAR")

                let meal = {name: "secMeal" + j, ingredients: [], mealType: 'Snack'};

                const ingredientFromDb = await this.getRandomIngredientByType("Snack");
                console.log("INGREDIENTUL SECUNDAR PRIMUL ESTE ", ingredientFromDb)
                if (ingredientFromDb) {

                    meal.ingredients.push(ingredientFromDb);
                    console.log("Added ingredient for snack", ingredientFromDb);
                } else {
                    console.error("Failed to retrieve ingredient for snack");
                }
                dayMenu.push(meal);
            }

            const mainMealTypes = ['Breakfast', 'Lunch', 'Dinner'];
            let t = 0;

            for (let k = 0; k < prerequisites.mainMealsCount; k++) {
                let meal = {name: "mainMeal" + k, ingredients: [], mealType: mainMealTypes[t]};

                const ingredientFromDb = await this.getRandomIngredientByType(mainMealTypes[t]);
                console.log("INGREDIENTUL PRINCIPAL PRIMUL ESTE ", ingredientFromDb)

                if (ingredientFromDb) {
                    meal.ingredients.push(ingredientFromDb);
                    console.log("Added ingredient for main meal", ingredientFromDb);
                } else {
                    console.error(`Failed to retrieve ingredient for main meal type: ${mainMealTypes[t]}`);
                }
                dayMenu.push(meal);

                if (t === mainMealTypes.length - 1) {
                    t = 0;
                } else {
                    t++;
                }
            }

            console.log("AICI SE FACE PROCESARE");
            menu.push(await this.dayMenuPostProcessing(dayMenu, kcalsPerMeal));
        }

        return menu;

    },
    getCategoriesMatchedCombinations() {
        return [
            {
                main: 'proteins',
                sec: ['moderately starchy vegetables', 'non-starchy vegetables']
            },
            {
                main: 'carbohydrates',
                sec: ['moderately starchy vegetables', 'non-starchy vegetables']
            },
            {
                main: 'lipids',
                sec: ['non-starchy vegetables']
            }
        ];
    },
    getIngredientAllowedTobeModified(meal, forAdded = false) {
        let ingredientToBeModified = {};

        const mainIngredient = this.getMainIngredient(meal.ingredients);
        if (mainIngredient) {
            const secIngredient = this.getSecondaryIngredient(meal.ingredients)
            if (secIngredient) {
                if (secIngredient.kcals < 0.6 * mainIngredient.kcals) {
                    ingredientToBeModified = forAdded ? secIngredient : mainIngredient
                } else {
                    ingredientToBeModified = forAdded ? mainIngredient : secIngredient
                }
            } else {
                ingredientToBeModified = mainIngredient;
            }
        } else {
            const secondaryIngredient = this.getSecondaryIngredient(meal.ingredients);
            if (!secondaryIngredient) {
                console.error("Secondary element not found")
                return;
            }
            ingredientToBeModified = secondaryIngredient;
        }
        return ingredientToBeModified;
    },
    getNumberOfMainIngredients(ingredients) {
        let count = 0;
        ingredients.forEach(ingredient => {
            if (ingredient.category === "proteins" || ingredient.category === "lipids" || ingredient.category === "carbohydrates") {
                count++;
            }
        });
        return count;
    },

    async dayMenuPostProcessing(dayMenu, kcalsPerMeal) {
        const combination = this.getCategoriesMatchedCombinations()
        for (let index = 0; index < dayMenu.length; index++) {

            let meal = dayMenu[index];
            const totalCaloriesNeededPerMeal = meal.name.startsWith("mainMeal") ? kcalsPerMeal.kcalsPerMainMeal : kcalsPerMeal.kcalsPerSecondaryMeal;

            console.log("AM NEVOIE DE KCAL PT PRINCIPAL: ", kcalsPerMeal.kcalsPerMainMeal);
            console.log("AM NEVOIE DE KCAL PT SECUNDAR: ", kcalsPerMeal.kcalsPerSecondaryMeal);

            while (!this.isMealCaloriesOk(dayMenu[index], totalCaloriesNeededPerMeal)) {
                console.log("Iubirica day many index", dayMenu[index], index);
                let mealKcals = 0;
                let forceModifyQuantity = false;
                meal.ingredients.forEach(ingredient => {
                    if (ingredient) {
                        console.log("INGREDIENTUL ARE ", ingredient.kcals);
                        console.log("MASA ARE", mealKcals);
                        mealKcals += ingredient.kcals;
                        console.log("MASA ARE", mealKcals);
                    } else {
                        console.error("Undefined ingredient detected in meal", meal);
                    }
                });

                if (mealKcals < totalCaloriesNeededPerMeal * 0.6) {

                    const mainIngredient = this.getMainIngredient(meal.ingredients);
                    let matchedCategories = [];
                    if (mainIngredient) {
                        //
                        if (meal.ingredients.length === 1) {
                            const comb = combination.find(elm => elm.main === mainIngredient.category);
                            if (!comb) {
                                console.error("No combination found for " + mainIngredient)
                                return;
                            }
                            matchedCategories.push(...comb.sec)
                        } else {
                            const numberOfMainIngredients = this.getNumberOfMainIngredients(meal.ingredients);
                            const numberOfSecIngredients = meal.ingredients.length - numberOfMainIngredients;

                            if (numberOfMainIngredients === numberOfSecIngredients) {
                                combination.forEach(elm => {
                                    if (mainIngredient.category === 'lipids') {
                                        forceModifyQuantity = true;
                                    } else {
                                        if (elm.main !== mainIngredient.category) {
                                            matchedCategories.push(elm.main);
                                        }
                                    }
                                })
                                if (matchedCategories.length === 0) {
                                    forceModifyQuantity = true;
                                }
                            } else {
                                const comb = combination.find(elm => elm.main === mainIngredient.category);
                                if (comb) {
                                    matchedCategories.push(...comb.sec);
                                }
                            }
                        }
                    } else {
                        const secondaryIngredient = this.getSecondaryIngredient(meal.ingredients)
                        if (!secondaryIngredient) {
                            console.error("Secondary element not found")
                        }

                        combination.forEach(elm => {
                            if (elm.sec.includes(secondaryIngredient.category)) {
                                matchedCategories.push(elm.main)
                            }
                        })
                    }

                    if (matchedCategories.length > 0) {

                        const category = matchedCategories[Math.floor(Math.random() * matchedCategories.length)];

                        const ingredient = await this.getRandomIngredientByTypeAndCategory(meal.mealType, category);
                        if (ingredient) {
                            meal.ingredients.push(ingredient);
                            console.log("Ingredient added to meal:", ingredient);
                        } else {
                            console.error("No ingredient found for category", category);
                            console.error(matchedCategories)
                        }
                    }
                } else if ((mealKcals > 0.6 * totalCaloriesNeededPerMeal && mealKcals < totalCaloriesNeededPerMeal + 0.05 * totalCaloriesNeededPerMeal)
                    || forceModifyQuantity) {
                    let ingredientToBeModified = this.getIngredientAllowedTobeModified(meal, true);

                    meal.ingredients.forEach(ingredient => {
                        if (ingredient === ingredientToBeModified) {
                            this.modifyIngredient(ingredient, 0.5);
                            console.log("Ingredient modified: add", ingredient);
                        }
                    });
                } else if (mealKcals > totalCaloriesNeededPerMeal + 0.05 * totalCaloriesNeededPerMeal) {
                    let ingredientToBeModified = this.getIngredientAllowedTobeModified(meal)

                    // modify ingredient
                    meal.ingredients.forEach(ingredient => {
                        if (ingredient === ingredientToBeModified) {
                            this.modifyIngredient(ingredient, -0.1);
                            console.log("Ingredient modified: sub", ingredient);
                        }
                    });
                }
                dayMenu[index] = meal;
                console.log("DEBUG LOG AFTER OPERATION:", meal);
            }
        }
        return dayMenu;
    },


    modifyIngredient(ingredient, percentage) {
        if (ingredient) {
            const matches = ingredient.name.match(/(\d+(?:\.\d+)?)\s*(.+)/);
            if (matches) {
                let quantity = parseFloat(matches[1]);
                let text = matches[2];

                quantity += percentage * quantity;
                ingredient.name = `${quantity.toFixed(2)} ${text}`;

                ingredient.name = ingredient.name.trim();
            }
            ingredient.kcals += percentage * ingredient.kcals;
            ingredient.carbohydrates += percentage * ingredient.carbohydrates;
            ingredient.lipids += percentage * ingredient.lipids;
            ingredient.proteins += percentage * ingredient.proteins;
            ingredient.calcium += percentage * ingredient.calcium;
            ingredient.zinc += percentage * ingredient.zinc;
            ingredient.magnesium += percentage * ingredient.magnesium;
            ingredient.iron += percentage * ingredient.iron;
            ingredient.sodium += percentage * ingredient.sodium;
            ingredient.potassium += percentage * ingredient.potassium;
            ingredient.phosphorus += percentage * ingredient.phosphorus;
            ingredient.vitamin_A += percentage * ingredient.vitamin_A;
            ingredient.vitamin_E += percentage * ingredient.vitamin_E;
            ingredient.thiamin += percentage * ingredient.thiamin;
            ingredient.riboflavin += percentage * ingredient.riboflavin;
            ingredient.niacin += percentage * ingredient.niacin;
            ingredient.vitamin_B6 += percentage * ingredient.vitamin_B6;
            ingredient.vitamin_B12 += percentage * ingredient.vitamin_B12;
            ingredient.vitamin_C += percentage * ingredient.vitamin_C;
            ingredient.vitamin_K += percentage * ingredient.vitamin_K;
            ingredient.vitamin_D += percentage * ingredient.vitamin_D;
            ingredient.sugar += percentage * ingredient.sugar;
            ingredient.fiber += percentage * ingredient.fiber;
        }
    },

    getMainIngredient(ingredients) {
        const categories = this.getCategoriesMatchedCombinations();
        let mainIngredients = [];

        ingredients.forEach((ingredient) => {
            categories.forEach(category => {
                if (category.main === ingredient.category) {
                    mainIngredients.push(ingredient);
                }
            });
        });

        if (mainIngredients.length > 0) {
            return mainIngredients[Math.floor(Math.random() * mainIngredients.length)];
        }
        return null;
    },

    getSecondaryIngredient(ingredients) {
        const categories = this.getCategoriesMatchedCombinations();
        let secIngredients = [];

        ingredients.forEach((ingredient) => {
            categories.forEach(category => {
                if (category.sec.includes(ingredient.category)) {
                    secIngredients.push(ingredient);
                }
            });
        });

        if (secIngredients.length > 0) {
            return secIngredients[Math.floor(Math.random() * secIngredients.length)];
        }
        return null;
    },

    isMealCaloriesOk(meal, totalCaloriesNeededPerMeal) {
        let totalCalories = 0;
        meal.ingredients.forEach(ingredient => {
            console.log(ingredient)
            if (ingredient) {
                totalCalories += ingredient.kcals;
            }
        });
        return totalCalories < totalCaloriesNeededPerMeal + 0.05 * totalCaloriesNeededPerMeal && totalCalories > totalCaloriesNeededPerMeal - 0.05 * totalCaloriesNeededPerMeal;
    }
};

export default menuGenerator;
