import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
    participants: {
        type: [String],
        required: true
    },
    lastMessageId: {
        type: String,
        required: false
    }
}, {collection: 'conversations'}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

export default Conversation;