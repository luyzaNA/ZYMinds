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
        type: Number,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    }
});

const Profile = mongoose.model('Profile', ProfileSchema);

export default Profile;