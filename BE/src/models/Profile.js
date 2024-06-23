import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: false
    },
    rating: {
        type: [Number],
        required: true
    },
    averageRating: {
        type: Number,
        default: 5
    }
});

const Profile = mongoose.model('Profile', ProfileSchema);

export default Profile;