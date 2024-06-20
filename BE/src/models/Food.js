import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        // enum: ['simple', 'compound'],
        request: true
    },
    mealType: [{
        type: String,
        required: true
    }],
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
    calcium: {
        type: Number,
        required: true
    },
    zinc: {
        type: Number,
        required: true
    },
    magnesium: {
        type: Number,
        required: true
    },
    iron: {
        type: Number,
        required: true
    },
    sodium: {
        type: Number,
        required: true
    },
    potassium: {
        type: Number,
        required: true
    },
    phosphorus: {
        type: Number,
        required: true
    },
    vitamin_A: {
        type: Number,
        required: true
    },
    vitamin_E: {
        type: Number,
        required: true
    },
    thiamin: {
        type: Number,
        required: true
    },
    riboflavin: {
        type: Number,
        required: true
    },
    niacin: {
        type: Number,
        required: true
    },
    vitamin_B6: {
        type: Number,
        required: true
    },
    vitamin_B12: {
        type: Number,
        required: true
    },
    vitamin_C: {
        type: Number,
        required: true
    },
    vitamin_K: {
        type: Number,
        required: true
    },
    vitamin_D: {
        type: Number,
        required: true
    },
    sugar: {
        type: Number,
        required: true
    },
    fiber: {
        type: Number,
        required: true
    }
}, {collection: 'food'}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

FoodSchema.index({ name: 1 });


const Food = mongoose.model('Food', FoodSchema);

export default Food;
