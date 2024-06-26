import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
    linkId: {
        type: String,
        required: true
    },
    daily_intake: {
        type: Object,
        required: true
    },
    meals: {
        type: [Object],
        required: true
    },
    status: {
        type: String,
        required: true
    },
}, {
    collection: 'menus',
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

const Menu = mongoose.model('Menu', MenuSchema);

export default Menu;
