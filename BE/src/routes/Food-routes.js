import express from 'express';
import Food from '../models/Food.js';

const foodRouter = express.Router();

foodRouter.get('/food', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

foodRouter.post('/food', async (req, res) => {
 
  const food = new Food({
    name: req.body.name,
    kcals: req.body.kcals,
    proteins: req.body.proteins,
    lipids: req.body.lipids,
    carbohydrates: req.body.carbohydrates,
    meal: req.body.meal
  });

  try {
    const newFood = await food.save();
    res.status(201).json(newFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default foodRouter;
