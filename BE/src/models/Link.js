import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({

    clientId:{
        type: String,
        required: true
    },
    coachId:{
        type: String,
        required: true
    },
    statusApplication: {
        type: String,
        required: true
    },
    message:{
        type: String,
        required: false
    }
}, {collection: 'links'}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

const Link = mongoose.model('Link', LinkSchema);

export default Link;