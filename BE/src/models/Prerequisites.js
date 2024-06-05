import mongoose from "mongoose";

const PrerequisitesSchema = new mongoose.Schema({
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    target: {
        type: String,
        enum: ['LOSE WEIGHT', 'GAIN WEIGHT'],
        required: true
    },
    intolerances: {
        type: [String],
        required: true
    },
    linkId: {
        type: String,
        required: true
    },
    activityLevel: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['female', 'male'],
        required: true
    }
}, {
    collection: 'prerequisites',
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

const Prerequisites = mongoose.model('Prerequisites', PrerequisitesSchema);
export default Prerequisites
