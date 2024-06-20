const extractNutrients = (response) => {
    const { totalNutrients } = response;
    return {
        kcals: totalNutrients.ENERC_KCAL.quantity,
        proteins: totalNutrients.PROCNT.quantity,
        carbohydrates: totalNutrients.CHOCDF.quantity,
        lipids: totalNutrients.FAT.quantity,
        calcium: totalNutrients.CA?.quantity,
        zinc: totalNutrients.ZN?.quantity,
        magnesium: totalNutrients.MG?.quantity,
        iron: totalNutrients.FE?.quantity,
        sodium: totalNutrients.NA?.quantity,
        potassium: totalNutrients.K?.quantity,
        phosphorus: totalNutrients.P?.quantity,
        vitamin_A: totalNutrients.VITA_RAE?.quantity,
        vitamin_E: totalNutrients.TOCPHA?.quantity,
        thiamin: totalNutrients.THIA?.quantity,
        riboflavin: totalNutrients.RIBF?.quantity,
        niacin: totalNutrients.NIA?.quantity,
        vitamin_B6: totalNutrients.VITB6A?.quantity,
        vitamin_B12: totalNutrients.VITB12?.quantity,
        vitamin_C: totalNutrients.VITC?.quantity,
        vitamin_K: totalNutrients.VITK1?.quantity,
        vitamin_D: totalNutrients.VITD?.quantity,
        sugar: totalNutrients.SUGAR?.quantity,
        fiber: totalNutrients.FIBTG?.quantity
    };
};

export default extractNutrients;
