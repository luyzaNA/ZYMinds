import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    conversationId: {
        type: String,
        required: true
    }
}, { collection: 'messages' }, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});


const Message = mongoose.model('Message', MessageSchema);

export default Message;