const NutritionCalculator = {
    calculateBMR(gender, weight, height, age) {
        let basalMetabolicRate;

        if (gender === 'male') {
            basalMetabolicRate = 66 + (13.7 * weight) + (5 * height) - (6.8 * age);
        } else if (gender === 'female') {
            basalMetabolicRate = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
        } else {
            throw new Error("Invalid gender provided. Use 'male' or 'female'.");
        }
        return basalMetabolicRate;
    },

    calculateTotalCaloricNeeds(basalMetabolicRate, activityLevel) {
        return basalMetabolicRate * activityLevel;
    },

    calculateAdjustedCaloricNeeds(totalCaloricNeeds, goal) {
        let adjustedCaloricNeeds;

        if (goal === 'LOSE WEIGHT') {
            adjustedCaloricNeeds = totalCaloricNeeds - 500;
        } else if (goal === 'GAIN WEIGHT') {
            adjustedCaloricNeeds = totalCaloricNeeds + 400;
        } else {
            throw new Error("Invalid goal provided. Use 'LOSE WEIGHT' or 'GAIN WEIGHT'.");
        }

        return adjustedCaloricNeeds;
    },

    calculateDailyHydrationNeeds(weight) {
        return weight * 30 - 35;
    },

    calculateIdealWeight(gender, height, age) {
        let idealWeight;

        if (gender === 'male') {
            idealWeight = height - 100 - ((height - 150) / 4) + ((age - 20) / 4);
        } else if (gender === 'female') {
            idealWeight = height - 100 - ((height - 150) / 2.5) + ((age - 20) / 6);
        } else {
            throw new Error("Invalid gender provided. Use 'male' or 'female'.");
        }

        return idealWeight;
    },

    calculateBMI(weight, height) {
        const heightInMeters = height / 100;

        return weight / (heightInMeters * heightInMeters);
    },

    calculateFatNeeds(totalCaloricNeeds) {
        const fatPercentage = 0.25;
        const fatCalories = totalCaloricNeeds * fatPercentage;

        return fatCalories / 9;
    },

    calculateProteinNeeds(totalCaloricNeeds, goal) {
        let proteinPercentage;

        if (goal === 'LOSE WEIGHT') {
            proteinPercentage = 0.25;
        } else if (goal === 'GAIN WEIGHT') {
            proteinPercentage = 0.30;
        } else {
            throw new Error("Invalid goal provided. Use 'LOSE WEIGHT' or 'GAIN WEIGHT'.");
        }

        const proteinCalories = totalCaloricNeeds * proteinPercentage;
        return proteinCalories / 4;
    },

    calculateCarbNeeds(totalCaloricNeeds, proteinCalories, fatCalories) {
        const proteinAndFatCalories = proteinCalories + fatCalories;
        const carbCalories = totalCaloricNeeds - proteinAndFatCalories;

        return carbCalories / 4;
    },


    calculateMealCalories(mainMealsCount, secondaryMealsCount, totalKcals) {
        const mainMealsPercentage = 0.90;
        const secondaryMealsPercentage = 0.10;

        const totalKcalsForMainMeals = totalKcals * mainMealsPercentage;
        const totalKcalsForSecondaryMeals = totalKcals * secondaryMealsPercentage;

        const kcalsPerMainMeal = totalKcalsForMainMeals / mainMealsCount;
        const kcalsPerSecondaryMeal = totalKcalsForSecondaryMeals / secondaryMealsCount;

        return {
            kcalsPerMainMeal: kcalsPerMainMeal,
            kcalsPerSecondaryMeal: kcalsPerSecondaryMeal
        };
    },

    getRandomNumber (max) {
        return Math.floor(Math.random() * (max + 1));
    }
};



export default NutritionCalculator;