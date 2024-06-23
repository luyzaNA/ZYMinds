import express from 'express';
import Food from '../models/Food.js';
import extractNutrients from '../utlis/extractNutrients.js';
import alimentsData from "../utlis/alimentsData.js";
import fetch from 'node-fetch';
import currentUser from "../middlewares/current-user.js";
import requireAuth from "../middlewares/require-auth.js";

const APP_ID = process.env.APP_ID ;
const APP_KEY = process.env.APP_KEY ;

const foodRouter = express.Router();

foodRouter.get('/foods', currentUser, requireAuth, async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

foodRouter.get('/populate-foods', currentUser, requireAuth, async (req, res) => {
    const fetchNutrients = async (aliment) => {
        try {
            const response = await fetch(`https://api.edamam.com/api/nutrition-data?app_id=${APP_ID}&app_key=${APP_KEY}&ingr=${encodeURIComponent(aliment)}`);
            const data = await response.json();

            if (!data.totalNutrients) {
                console.error('No nutrients data found for', aliment);
                return null;
            }
            return extractNutrients(data);
        } catch (error) {
            console.error('Error fetching nutrients:', error);
            return null;
        }
    };

    const processAliment = async (aliment) => {
        try {
            const existingFood = await Food.findOne({name: aliment.name});
            if (existingFood) {
                console.log(`Food "${aliment.name}" already exists. Skipping.`);
                return null;
            }

            if (aliment.type === 'compound' && aliment.ingredients) {
                let totalNutrients = {};
                let processedIngredients = [];

                for (const ingredient of aliment.ingredients) {
                    console.log("Ingredient:", ingredient);

                    const [quantity, ...nameParts] = ingredient.split(' ');
                    const name = nameParts.join(' ');

                    const ingredientData = await fetchNutrients(ingredient);
                    if (ingredientData) {
                        processedIngredients.push({name, quantity});

                        for (const nutrient in ingredientData) {
                            if (!totalNutrients[nutrient]) {
                                totalNutrients[nutrient] = ingredientData[nutrient];
                            } else {
                                totalNutrients[nutrient] += ingredientData[nutrient];
                            }
                        }
                    } else {
                        console.error(`No data found for ingredient ${ingredient}`);
                    }
                }

                return {totalNutrients, processedIngredients};
            } else {
                const nutrientData = await fetchNutrients(aliment.name);
                return {totalNutrients: nutrientData, processedIngredients: []};
            }
        } catch (error) {
            console.error(`Error processing aliment "${aliment.name}":`, error);
            return null;
        }
    };

    for (const aliment of alimentsData) {
        const result = await processAliment(aliment);
        if (result) {
            const {totalNutrients, processedIngredients} = result;
            try {
                const newFood = new Food({
                    name: aliment.name,
                    type: aliment.type,
                    ingredients: processedIngredients,
                    mealType: aliment.mealType,
                    kcals: totalNutrients.kcals,
                    proteins: totalNutrients.proteins || 0,
                    lipids: totalNutrients.lipids || 0,
                    carbohydrates: totalNutrients.carbohydrates || 0,
                    calcium: totalNutrients.calcium || 0,
                    zinc: totalNutrients.zinc || 0,
                    magnesium: totalNutrients.magnesium || 0,
                    iron: totalNutrients.iron || 0,
                    sodium: totalNutrients.sodium || 0,
                    potassium: totalNutrients.potassium || 0,
                    phosphorus: totalNutrients.phosphorus || 0,
                    vitamin_A: totalNutrients.vitamin_A || 0,
                    vitamin_E: totalNutrients.vitamin_E || 0,
                    thiamin: totalNutrients.thiamin || 0,
                    riboflavin: totalNutrients.riboflavin || 0,
                    niacin: totalNutrients.niacin || 0,
                    vitamin_B6: totalNutrients.vitamin_B6 || 0,
                    vitamin_B12: totalNutrients.vitamin_B12 || 0,
                    vitamin_C: totalNutrients.vitamin_C || 0,
                    vitamin_K: totalNutrients.vitamin_K || 0,
                    vitamin_D: totalNutrients.vitamin_D || 0,
                    sugar: totalNutrients.sugar || 0,
                    fiber: totalNutrients.fiber || 0
                });
                await newFood.save();
                console.log(`Saved food: ${aliment.name}`);
            } catch (error) {
                console.error(`Error saving food "${aliment.name}":`, error);
            }

        }
    }

    await fetchNutrients()
});

export default foodRouter;
