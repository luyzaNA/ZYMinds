import NutritionCalculator from "./nutritionCalculator.js";
import Food from "../models/Food.js";
import prerequisites from "../models/Prerequisites.js";

const menuGenerator = {
    async getRandomIngredientByType(type, intolerances) {
        const ingredientsCount = await Food.countDocuments({
            mealType: {$elemMatch: {$eq: type}},
            _id: {$nin: intolerances}
        });
        const randomIndex = NutritionCalculator.getRandomNumber(ingredientsCount - 1);
        const snack = await Food.find({
            mealType: {$elemMatch: {$eq: type}},
            _id: {$nin: intolerances}
        }).limit(1).skip(randomIndex);
        return snack[0];
    },
    async getRandomIngredientByTypeAndCategory(type, category, intolerances) {
        const ingredientsCount = await Food.countDocuments({
            mealType: {$elemMatch: {$eq: type}},
            category: category,
            _id: {$nin: intolerances}
        });
        const randomIndex = NutritionCalculator.getRandomNumber(ingredientsCount - 1);
        const ingredient = await Food.find({
            mealType: {$elemMatch: {$eq: type}}, category: category,
            _id: {$nin: intolerances}
        }).limit(1).skip(randomIndex);
        return ingredient[0];
    },
    async generateMenuForDays(prerequisites, kcalsPerMeal, macroNutrients) {
        const numberOfDays = 30;
        let menu = [];

        for (let i = 0; i < numberOfDays; i++) {
            let dayMenu = [];

            // generate initial secondary meals
            for (let j = 0; j < prerequisites.secondaryMealsCount; j++) {

                let meal = {name: "secMeal" + j, ingredients: [], mealType: 'Snack'};

                const ingredientFromDb = await this.getRandomIngredientByType("Snack", prerequisites.intolerances);

                if (ingredientFromDb) {
                    meal.ingredients.push(ingredientFromDb);
                } else {
                    console.error("Failed to retrieve ingredient for snack");
                }
                dayMenu.push(meal);
            }

            // generate initial main meals
            const mainMealTypes = ['Breakfast', 'Lunch', 'Dinner'];
            let t = 0;
            for (let k = 0; k < prerequisites.mainMealsCount; k++) {
                let meal = {name: "mainMeal" + k, ingredients: [], mealType: mainMealTypes[t]};

                const ingredientFromDb = await this.getRandomIngredientByType(mainMealTypes[t], prerequisites.intolerances);

                if (ingredientFromDb) {
                    meal.ingredients.push(ingredientFromDb);
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

            ////////////////

            console.log("StartProcessing...");
            menu.push(await this.dayMenuPostProcessing(dayMenu, kcalsPerMeal, macroNutrients));
        }

        return menu;

    },
    async dayMenuPostProcessing(dayMenu, kcalsPerMeal, macroNutrients) {
        const combination = this.getCategoriesMatchedCombinations()
        for (let index = 0; index < dayMenu.length; index++) {
            let meal = dayMenu[index];
            const totalCaloriesNeededPerMeal = meal.name.startsWith("mainMeal") ? kcalsPerMeal.kcalsPerMainMeal : kcalsPerMeal.kcalsPerSecondaryMeal;

            while (!this.isMealCaloriesOk(dayMenu[index], totalCaloriesNeededPerMeal)) {
                let mealKcals = 0;
                let forceModifyQuantity = false;

                meal.ingredients.forEach(ingredient => {
                    if (ingredient) {
                        mealKcals += ingredient.kcals;
                    } else {
                        console.error("Undefined ingredient detected in meal", meal);
                    }
                });

                if (mealKcals < totalCaloriesNeededPerMeal * 0.6) {
                    let skipAdding = false;
                    if (meal.mealType === 'Snack' && meal.ingredients.length === 2) {
                        skipAdding = true;
                        forceModifyQuantity = true;
                    }

                    if (!skipAdding) {
                        const mainIngredient = this.getMainIngredient(meal.ingredients);
                        let matchedCategories = [];
                        if (mainIngredient) {
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
                                        if (mainIngredient.category === 'lipids' && elm.main === 'carbohydrates') {
                                            console.log("LIPIDS")
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

                            const ingredient = await this.getRandomIngredientByTypeAndCategory(meal.mealType, category, prerequisites.intolerances);
                            if (ingredient) {
                                meal.ingredients.push(ingredient);
                                console.log("Ingredient added to meal:", ingredient);
                            } else {
                                console.error("No ingredient found for category", category);
                                console.error(matchedCategories)
                            }
                        }
                    }
                }
                if ((mealKcals > 0.6 * totalCaloriesNeededPerMeal && mealKcals < totalCaloriesNeededPerMeal + 0.05 * totalCaloriesNeededPerMeal)
                    || (forceModifyQuantity && (mealKcals < totalCaloriesNeededPerMeal + 0.05 * totalCaloriesNeededPerMeal))) {

                    let ingredientToBeModified = this.getIngredientAllowedTobeModified(meal, true);

                    meal.ingredients.forEach(ingredient => {
                        if (ingredient === ingredientToBeModified) {
                            this.modifyIngredient(ingredient, 0.1);
                        }
                    });
                }
                if ((mealKcals > totalCaloriesNeededPerMeal + 0.05 * totalCaloriesNeededPerMeal)) {
                    let ingredientToBeModified = this.getIngredientAllowedTobeModified(meal)
                    // modify ingredient
                    meal.ingredients.forEach(ingredient => {
                        if (ingredient === ingredientToBeModified) {
                            this.modifyIngredient(ingredient, -0.1);
                        }
                    });
                }

                dayMenu[index] = meal;
            }
        }


        function getActualMenuMacronutrients() {
            let proteins = 0;
            let lipids = 0;
            let carbohydrates = 0;

            dayMenu.forEach(meal => {
                meal.ingredients.forEach(ingredient => {
                    proteins += ingredient.proteins;
                    lipids += ingredient.lipids;
                    carbohydrates += ingredient.carbohydrates;
                });
            });
            return {
                proteins, lipids, carbohydrates
            }
        }

        let actualMenuMacronutrients = getActualMenuMacronutrients()

        let allIngredients = [];
        dayMenu.forEach(meal => {
            allIngredients.push(...meal.ingredients);
        })

        // Create sorted arrays
        const sortedByLipids = this.sortByAttribute(allIngredients, 'lipids');

        let forceBreak = false

        // surplus lipids
        while ((macroNutrients.fat + 0.05 * macroNutrients.fat) < actualMenuMacronutrients.lipids && !forceBreak) {
            if (actualMenuMacronutrients.lipids - macroNutrients.fat > 0.05 * macroNutrients.fat) {
                for (let mealIndex = 0; mealIndex < dayMenu.length; mealIndex++) {
                    for (let ingredientIndex = 0; ingredientIndex < dayMenu[mealIndex].ingredients.length; ingredientIndex++) {
                        if (dayMenu[mealIndex].ingredients[ingredientIndex] === sortedByLipids[0]) {

                            // deficit carbs
                            if ((macroNutrients.carbs - 0.05 * macroNutrients.carbs) > actualMenuMacronutrients.carbohydrates) {
                                let meal = dayMenu[mealIndex]
                                let mealType = meal.mealType;
                                let ingredientTobeAdded = await this.getRandomIngredientByTypeAndCategory(mealType, "carbohydrates", prerequisites.intolerances);
                                const totalCaloriesNeededPerMeal = meal.name.startsWith("mainMeal") ? kcalsPerMeal.kcalsPerMainMeal : kcalsPerMeal.kcalsPerSecondaryMeal;
                                const mealKcals = this.getMealKcals(meal);

                                this.modifyIngredient(ingredientTobeAdded, (totalCaloriesNeededPerMeal - mealKcals) / ingredientTobeAdded.kcals);
                                sortedByLipids.slice(0, 1)
                                dayMenu[mealIndex].ingredients[ingredientIndex] = ingredientTobeAdded;
                            } else if (dayMenu[mealIndex].ingredients.lenght > 2) {
                                dayMenu[mealIndex].ingredients.slice(ingredientIndex, 1)

                                ///deficit proteins
                            } else if ((macroNutrients.protein + 0.05 * macroNutrients.protein) < actualMenuMacronutrients.proteins) {
                                let meal = dayMenu[mealIndex]
                                let mealType = meal.mealType;
                                let ingredientTobeAdded = await this.getRandomIngredientByTypeAndCategory(mealType, "proteins", prerequisites.intolerances);
                                const totalCaloriesNeededPerMeal = meal.name.startsWith("mainMeal") ? kcalsPerMeal.kcalsPerMainMeal : kcalsPerMeal.kcalsPerSecondaryMeal;
                                const mealKcals = this.getMealKcals(meal);

                                this.modifyIngredient(ingredientTobeAdded, (totalCaloriesNeededPerMeal - mealKcals) / ingredientTobeAdded.kcals);
                                sortedByLipids.slice(sortedByLipids.length - 1, 1)
                                dayMenu[mealIndex].ingredients[ingredientIndex] = ingredientTobeAdded;
                            }
                        } else {
                            forceBreak = true;

                        }
                    }
                }
            } else {
                break;
            }
            actualMenuMacronutrients = getActualMenuMacronutrients()
        }
        forceBreak = false;
        //deficit lipids
        while ((macroNutrients.fat - 0.05 * macroNutrients.fat) > actualMenuMacronutrients.lipids && !forceBreak) {
            if (macroNutrients.fat - actualMenuMacronutrients.lipids > macroNutrients.fat - 0.05 * macroNutrients.fat) {
                for (let mealIndex = 0; mealIndex < dayMenu.length; mealIndex++) {
                    for (let ingredientIndex = 0; ingredientIndex < dayMenu[mealIndex].ingredients.length; ingredientIndex++) {
                        if (dayMenu[mealIndex].ingredients[ingredientIndex] === sortedByProteins[sortedByProteins.length - 1]) {

                            //surplus proteins
                            if ((macroNutrients.protein + 0.05 * macroNutrients.protein) < actualMenuMacronutrients.proteins) {
                                let meal = dayMenu[mealIndex]
                                let mealType = meal.mealType;
                                let ingredientTobeAdded = await this.getRandomIngredientByTypeAndCategory(mealType, "lipids", prerequisites.intolerances);
                                const totalCaloriesNeededPerMeal = meal.name.startsWith("mainMeal") ? kcalsPerMeal.kcalsPerMainMeal : kcalsPerMeal.kcalsPerSecondaryMeal;
                                const mealKcals = this.getMealKcals(meal);
                                this.modifyIngredient(ingredientTobeAdded, (totalCaloriesNeededPerMeal - mealKcals) / ingredientTobeAdded.kcals);
                                dayMenu[mealIndex].ingredients[ingredientIndex] = ingredientTobeAdded;
                                sortedByProteins.slice(sortedByProteins.length - 1, 1)

                                if (meal.ingredients.length > 2) {
                                    const carbo = meal.ingredients.find(elm => elm.category === "carbohydrates")
                                    if (carbo) {
                                        let nonStarchyIngredient = await this.getRandomIngredientByTypeAndCategory(mealType, "non-starchy vegetables", prerequisites.intolerances);
                                        const mealKcals = this.getMealKcals(meal);
                                        this.modifyIngredient(nonStarchyIngredient, (totalCaloriesNeededPerMeal - mealKcals) / nonStarchyIngredient.kcals);

                                        for (let mealIndex = 0; mealIndex < dayMenu.length; mealIndex++) {
                                            for (let ingredientIndex = 0; ingredientIndex < dayMenu[mealIndex].ingredients.length; ingredientIndex++) {
                                                if (dayMenu[mealIndex].ingredients[ingredientIndex] === carbo) {
                                                    dayMenu[mealIndex].ingredients[ingredientIndex] = nonStarchyIngredient
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                forceBreak = true
                            }

                        } else {
                            forceBreak = true;
                        }
                    }
                }
            } else {
                break;
            }
            actualMenuMacronutrients = getActualMenuMacronutrients()
        }
        return dayMenu;
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
                    // cazul cand cantitatea ingredientului o sa fie crescuta
                    if (forAdded) {
                        const matches = secIngredient.name.match(/(\d+(?:\.\d+)?)\s*(.+)/);
                        if (matches) {
                            let quantity = parseFloat(matches[1]);
                            if (quantity < 300) {
                                ingredientToBeModified = secIngredient;
                            } else {
                                ingredientToBeModified = mainIngredient;
                            }
                        }
                    } else {
                        ingredientToBeModified = mainIngredient;
                    }
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
    sortByAttribute(array, attribute) {
        // Creating a shallow copy of the array
        return array.slice().sort((a, b) => b[attribute] - a[attribute]);
    },
    getMealKcals(meal) {
        let mealKcals = 0;
        meal.ingredients.forEach(ingredient => mealKcals + ingredient.kcals)

        return mealKcals;
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
            if (ingredient) {
                totalCalories += ingredient.kcals;
            }
        });
        return totalCalories < totalCaloriesNeededPerMeal + 0.05 * totalCaloriesNeededPerMeal && totalCalories > totalCaloriesNeededPerMeal - 0.05 * totalCaloriesNeededPerMeal;
    }
};

export default menuGenerator;
