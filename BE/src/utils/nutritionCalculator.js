const NutritionCalculator = {

    //rata metabolica bazala
    //cantitatea minima de energie pe care organismul o consuma in repaus
    //energia necesara pentru mentinerea functiilor vitale
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

    // energia pe care o consuma organismul in functie de nivelul de activitate zilnica
    // se inmulteste bmr cu factorul de activitate care e:
    //     sedentary: 1.2           -> lipsa activitate
    //     lightlyActive: 1.375     ->1/3 zile pe saptmana
    //     moderatelyActive: 1.55   -> 3/5 zile pe saptmana
    //     veryActive: 1.725        -> >5 zile pe saptmana
     calculateTotalCaloricNeeds(basalMetabolicRate, activityLevel) {
        return basalMetabolicRate * activityLevel;
    },

    //se calculeaza in functie de obiectivul dorit nr de kcal necesare
    //se creeaza un deficit de 500kcal in caz de slabire
    //se adauga 400kcal in caz de cresetere masa musculara
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

    // weight este greutatea corporală în kilograme
    // rezulta necesarul de lichide zilnic  in ml
    calculateDailyHydrationNeeds(weight) {
        return weight * 30 - 35;
    },

    //functia calculeaza greutatea ideala
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

    //functia calculeaza indicele de masa corporala
    //IMC e raportul dintre kg si inaltimea transformata in m la patrat
    //in funtcie de valorea IMC ului se stabileste proportia de grasime corporala
    //valorile :
    // Subponderal:         IMC sub 18.5
    // Greutate normală:    IMC între 18.5 și 24.9
    // Supraponderal:       IMC între 25 și 29.9
    // Obezitate moderată:  IMC între 30 și 34.9
    // Obezitate severă:    IMC între 35 și 39.9
    // Obezitate morbidă:   IMC de 40 sau mai mult
    calculateBMI(weight, height) {
        const heightInMeters = height / 100;

        return weight / (heightInMeters * heightInMeters);
    },

    // necesarul zilnic de grasimi din totalCaloricNeeds
    //procentul de grasimi e 25% aprox
    //1g de grasimi are 9kcals
    calculateFatNeeds(totalCaloricNeeds) {
        const fatPercentage = 0.25;
        const fatCalories = totalCaloricNeeds * fatPercentage;

        return fatCalories / 9;
    },

    //daca se doreste crestere masa musculara se considerea cantitatea de proteine necesara
    //limita superioara a intervalului
    calculateProteinNeeds(weight, goal) {
        let proteinNeeds;
        if (goal === 'LOSE WEIGHT') {
            proteinNeeds = weight * 1.6
        } else if (goal === 'GAIN WEIGHT') {
            proteinNeeds = weight * 2.2;
        } else {
            throw new Error("Invalid goal provided. Use 'muscleGain' or 'weightLoss'.");
        }

        return proteinNeeds;
    },

    //in functie de cantitatile de proteine si lipide se calculeaza carbo
    //se scade din necesarul de kcal suma totala de kcal din proteine si lipide
    //se imparte la 4 pt ca 1g de carbo = 4 kcal
    calculateCarbNeeds(totalCaloricNeeds, proteinCalories, fatCalories) {
        const proteinAndFatCalories = proteinCalories + fatCalories;
        const carbCalories = totalCaloricNeeds - proteinAndFatCalories;

        return carbCalories / 4;
    }
};

module.exports = NutritionCalculator;