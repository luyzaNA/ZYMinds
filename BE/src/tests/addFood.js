import axios from 'axios';
import connectDB from '../db/conn.js';
import Food from '../models/Food.js';
import alimentsData from './alimentsData.js'; // Import the aliments data

const appId = '827905b7';
const appKey = '3e5a5cefda6766804bdb198ff3f99a87';
const apiUrl = 'https://api.edamam.com/api/nutrition-data';

async function fetchDataAndSaveToDB() {
  try {
    await connectDB();
    console.log('-------------CONNECTED');
    for (const ingr of alimentsData) {
      console.log('************** ALIMENT: ', ingr);

      const existingFood = await Food.findOne({ name: ingr.name });

      if (existingFood) {
        console.log(`Skipping ${ingr.name} as it already exists in the database.`);
        continue;
      }

      const params = {
        app_id: appId,
        app_key: appKey,
        ingr: ingr.name,
      };

      const response = await axios.get(apiUrl, { params });
      console.log(response.data);

      const { quantity: kcals } = response.data.totalNutrientsKCal.ENERC_KCAL;

      const food = new Food({
        name: ingr.name,
        kcals: kcals,
        proteins: 3,
        lipids: 31,
        carbohydrates: 3,
        meal: ingr.meal
      });

      const savedFood = await food.save();
      console.log('Data saved to MongoDB successfully:', savedFood);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchDataAndSaveToDB();