import express from 'express';
import Food from '../models/Food.js';
import extractNutrients from '../utlis/extractNutrients.js';
import alimentsData from "../tests/alimentsData.js";
import fetch from 'node-fetch';

const APP_ID = process.env.APP_ID ;
const APP_KEY = process.env.APP_KEY ;

const foodRouter = express.Router();

//se preiau datele despre alimentul dat ca parametru folosind API ul Edamam Nutrion Analysis
//daca alimentul nu contine datele nutrionale se returneaza null
//daca exista se extrag nutrientii din raspuns si se mapeaza la campurile din schema
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

//se cauta daca exista deja in db un aliment cu numele respectiv
//daca exista se returneaza null
//daca nu exista se verifica daca este un tip de mancare compus, format din mai multe ingrediente
//daca e adevarat se parcurge fieacre ingredient din campul de ingrediente
//se descopune din fiecare element al array ului de ingrediente numele si gramajul
//se apeleaza funcia care preiad datele despre fiecare aliment
//daca exista date primite ca raspuns dupa request ul catre API se parcurge fiecare nutrient din raspuns
//daca un nutrient nu exista deja in totalNutrients atunci se adauga, daca exista doar i se actualizeaza valoarea
//daca alimentul nu e compus se obtin datele nutrionale pe acel aliment
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

//se parcurge array ul de alimente si pt fiecare aliment se face procesare si sa creeaza un nou aliment
//alimentul se salveaza in baza de date
alimentsData.forEach(async (aliment) => {
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
});

export default foodRouter;
