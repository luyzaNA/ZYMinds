import mongoose from "mongoose";
import {Password} from "../services/Password.js";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
         unique: true,
    },
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: String,
        required: true
    },
    newCoach:{
        type:Boolean,
        required:true
    }
}, {
    toJSON:{
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
            }
        }
    });

const User = mongoose.model('User', UserSchema);
UserSchema.pre('save', async function(done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

export default User;