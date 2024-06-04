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
    }
}, {collection: 'messages'})

const Message = mongoose.model('Message', MessageSchema);

export default Message;