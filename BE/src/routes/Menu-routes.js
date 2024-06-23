import express from "express";
import Prerequisites from "../models/Prerequisites.js";
import Link from "../models/Link.js";
import Profile from "../models/Profile.js";
import NutritionCalculator from "../utlis/nutritionCalculator.js";
import {DRI} from "../models/DRI.js";
import menuGenerator from "../utlis/menuGenerator.js";
import Menu from "../models/Menu.js";
import MenuStatusAuthorization from "../models/menu-status.js";
import currentUser from "../middlewares/current-user.js";
import requireAuth from "../middlewares/require-auth.js";
import RoleAuthorization from "../models/role-auhorization.js";
import NotAuthorizedError from "../errors/not-authorized-errors.js";
import {param} from "express-validator";

const menuRouter = express.Router();

async function generateMenuAsync(prerequisites, mealCalories, macroNutrients) {
    try {
        const menus = await menuGenerator.generateMenuForDays(prerequisites, mealCalories, macroNutrients);
        const existingMenu = await Menu.findOne({linkId: prerequisites.linkId});

        if (existingMenu) {
            existingMenu.meals = menus;
            existingMenu.status = new MenuStatusAuthorization('GENERATED').name;
            await existingMenu.save();
        } else {
            throw new Error('Menu not found');
        }
    } catch (error) {
        console.error('Error generating menu:', error.message);
        throw error;
    }
}

menuRouter.post('/menu/:linkId', [
    param('linkId').not().isEmpty().withMessage('Invalid link id')
], currentUser, requireAuth, async (req, res) => {
    const linkId = req.params.linkId;
    if (req.currentUser.roles !== new RoleAuthorization('COACH').name) {
        throw new NotAuthorizedError();
    }
    const link = await Link.findById(linkId);

    if (!link) {
        return res.status(404).json({message: 'Link not found'});
    }
    const clientProfile = await Profile.findOne({userId: link.clientId});

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

    const bmr = NutritionCalculator.calculateBMR(gender, weight, height, age);

    const totalCaloricNeeds = NutritionCalculator.calculateTotalCaloricNeeds(bmr, activityLevel);

    const adjustedCaloricNeeds = NutritionCalculator.calculateAdjustedCaloricNeeds(totalCaloricNeeds, target);


    const idealWeight = NutritionCalculator.calculateIdealWeight(gender, height, age);

    const bmi = NutritionCalculator.calculateBMI(weight, height);

    const fatNeeds = NutritionCalculator.calculateFatNeeds(adjustedCaloricNeeds);

    const proteinNeeds = NutritionCalculator.calculateProteinNeeds(adjustedCaloricNeeds, target);

    const carbNeeds = NutritionCalculator.calculateCarbNeeds(adjustedCaloricNeeds, proteinNeeds, fatNeeds);

    const mealCalories = NutritionCalculator.calculateMealCalories(mainMealsCount, secondaryMealsCount, adjustedCaloricNeeds);

    let userDRI = null;

    DRI.forEach(element => {
        if (element.Group === gender && age >= element.Age_range[0] && age <= element.Age_range[1]) {
            userDRI = element;
        }
    });

    const macroNutrients = {
        protein: proteinNeeds,
        fat: fatNeeds,
        carbs: carbNeeds
    };

    try {
        let existingMenu = await Menu.findOneAndUpdate({linkId}, {
            status: new MenuStatusAuthorization('PROCESSING').name,
            daily_intake: {...macroNutrients, ...mealCalories},
            meals: []
        }, {new: true});

        if (!existingMenu) {
            existingMenu = new Menu({
                linkId,
                daily_intake: {...macroNutrients, ...mealCalories},
                meals: [],
                status: new MenuStatusAuthorization('PROCESSING').name
            });
            await existingMenu.save()
        }

        generateMenuAsync(prerequisites, mealCalories, macroNutrients);

        return res.status(200).json(existingMenu);
    } catch (error) {
        console.error("Error generating menu:", error);
        return res.status(500).json({message: 'Error generating menu'});
    }
})


menuRouter.get('/menu/:linkId', currentUser, requireAuth, [
    param('linkId').not().isEmpty().withMessage('Invalid link id')
], async (req, res) => {
    const linkId = req.params.linkId;
    try {
        const menu = await Menu.findOne({linkId});
        return res.status(200).json(menu);
    } catch (error) {
        console.error("Error getting menu:", error);
        throw error;
    }
});

menuRouter.put('/menu/:linkId', currentUser, requireAuth, [
    param('linkId').not().isEmpty().withMessage('Invalid link id'),
], async (req, res) => {
    if (req.currentUser.roles !== new RoleAuthorization('COACH').name) {
        throw new NotAuthorizedError();
    }
    const linkId = req.params.linkId;
    const body = req.body;
    if (!body) {
        return res.status(400).json({message: 'Missing request body'});
    }
    try {
        const menu = await Menu.findOneAndUpdate({linkId}, {...body}, {new: true});
        res.status(200).json(menu);
    } catch (error) {
        console.error("Error updating menu:", error);
        throw error;
    }
});

menuRouter.delete('/menu/:linkId', currentUser, requireAuth, [
    param('linkId').not().isEmpty().withMessage('Invalid link id')
], async (req, res) => {
    if (req.currentUser.roles !== new RoleAuthorization('COACH').name) {
        throw new NotAuthorizedError();
    }
    const linkId = req.params.linkId;
    try {
        const menu = await Menu.findOneAndDelete({linkId});
        return res.status(200).json({message: 'Menu deleted'});
    } catch (error) {
        console.error("Error deleting menu:", error);
        throw error;
    }
});

export default menuRouter;