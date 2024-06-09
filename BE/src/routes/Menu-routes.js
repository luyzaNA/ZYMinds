import express from "express";
import Prerequisites from "../models/Prerequisites.js";
import Link from "../models/Link.js";
import Profile from "../models/Profile.js";
import NutritionCalculator from "../utlis/nutritionCalculator.js";
import {DRI} from "../models/DRI.js";
import Food from "../models/Food.js";

const menuRouter = express.Router();


menuRouter.get('/menu', async (req, res) => {

    const foods = await Food.find();
    return res.status(200).json(foods);

})

//iau cu linkId ul link ul din care extrag client id ul
//cu lcient id ul extrag profile id ul din care mi aiu varsta
//cu link id ul iau preconditiile
menuRouter.get('/menu/:linkId', async (req, res) => {
    const linkId = req.params.linkId;

    const link = await Link.findById(linkId);

    if (!link) {
        return res.status(404).json({message: 'Link not found'});
    }

    const clientProfile = await Profile.findOne({userId: link.clientId});

    console.log(clientProfile)

    const prerequisites = await Prerequisites.findOne({linkId: linkId});

    if (!prerequisites) {
        return res.status(404).json({message: 'Prerequisites not found'});
    }

    const {
        weight,
        height,
        target,
        intolerances,
        gender,
        activityLevel,
        mainMealsCount,
        secondaryMealsCount
    } = prerequisites;
    const {age} = clientProfile;

    //calculez bmr ul
    const bmr = NutritionCalculator.calculateBMR(gender, weight, height, age);

    //calculez total de calorii dupa activitate
    const totalCaloricNeeds = NutritionCalculator.calculateTotalCaloricNeeds(bmr, activityLevel);

    //calculez necesarul de calorii in functie de target
    const adjustedCaloricNeeds = NutritionCalculator.calculateAdjustedCaloricNeeds(totalCaloricNeeds, target);

    //calculez pt a l informa pe user despre starea lui de sanatate:
    //reguattea ideala

    const idealWeight = NutritionCalculator.calculateIdealWeight(gender, height, age);

    //calculez bmi
    const bmi = NutritionCalculator.calculateBMI(weight, height);

    //calculez necesarul de grasimi
    const fatNeeds = NutritionCalculator.calculateFatNeeds(adjustedCaloricNeeds);

    //calculez necesarul de proteine
    const proteinNeeds = NutritionCalculator.calculateProteinNeeds(adjustedCaloricNeeds, target);

    //calculez necesarul de carbohidrati
    const carbNeeds = NutritionCalculator.calculateCarbNeeds(adjustedCaloricNeeds, proteinNeeds, fatNeeds);

    //calculez necesarul de calorii pentru fiecare masa
    const mealCalories = NutritionCalculator.calculateMealCalories(mainMealsCount, secondaryMealsCount, adjustedCaloricNeeds);

    let userDRI = null;
    DRI.forEach(element => {
        if (element.Group === gender && age >= element.Age_range[0] && element.Age_range[1] >= age) {
            userDRI = element;
        }
    })

    console.log("USER DRI:", userDRI);
    console.log("totalCaloricNeeds :", totalCaloricNeeds);
    console.log("adjustedCaloricNeeds :", adjustedCaloricNeeds);
    console.log("USER idealWeight:", idealWeight);
    console.log("USER bmi:", bmi);
    console.log("USER fatNeeds:", fatNeeds);
    console.log("USER proteinNeeds:", proteinNeeds);
    console.log("USER carbNeeds:", carbNeeds);
    console.log("USER mealCalories:", mealCalories);

    const numberOfDays = 30;

    for (let day = 0; day < numberOfDays; day++) {

        let menu = {};
        const snacksCount = await Food.countDocuments({mealType: {$elemMatch: {$eq: "Snack"}}});
        for (let secMeal = 0; secMeal < secondaryMealsCount; secMeal++) {
            let snackCalories = 0;
            let snackIndex = 0;
            let snacks = [];
            const snackName = `secMeal${secMeal + 1}`;

            while (snackCalories < mealCalories.kcalsPerSecondaryMeal && snackIndex < snacksCount) {
                const randomIndex = NutritionCalculator.getRandomNumber(snacksCount);
                const snack = await Food.find({mealType: {$elemMatch: {$eq: "Snack"}}}).limit(1).skip(randomIndex);

                if (snack.length === 0) {
                    console.log("Snack not found");
                    break;
                }

                const currentSnack = snack[0];
                snackCalories += currentSnack.kcals;
                snacks.push(currentSnack);
                snackIndex++;
            }

            if (snackCalories < mealCalories.kcalsPerSecondaryMeal) {
                console.log(`Unable to meet caloric needs for ${snackName} with available snacks`);
            }

            menu[snackName] = snacks;
            console.log(snacks);
        }
        for (let mainMeal = 0; mainMeal < mainMealsCount; mainMeal++) {

        }

        

    }


});

export default menuRouter;