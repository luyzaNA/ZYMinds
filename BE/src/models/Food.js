import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    kcals: {
        type: Number,
        required: true
    },
    proteins: {
        type: Number,
        required: true
    },
    lipids: {
        type: Number,
        required: true
    },
    carbohydrates: { 
        type: Number,
        required: true
    },
    meal: {
        type: [String],
        required: true,
    }
}, { collection: 'food' }); 

const Food = mongoose.model('Food', foodSchema);

export default Food;

