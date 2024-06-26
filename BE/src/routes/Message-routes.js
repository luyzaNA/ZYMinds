import express from "express";
import currentUser from "../middlewares/current-user.js";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import {formatDateTime} from "../utlis/format-date.js";
import User from "../models/User.js";
import requireAuth from "../middlewares/require-auth.js";
import {param} from "express-validator";
const messageRouter = express.Router();

messageRouter.post('/message/:conversationId', currentUser, requireAuth,[
    param('conversationId').isMongoId().withMessage('Invalid conversation ID'),
], async (req, res) => {
    const { content } = req.body;
    const senderId = req.currentUser.id;
    const conversationId = req.params.conversationId;

    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found.' });
        }

        const participants = conversation.participants;
        const receiverId = participants.find(participantId => participantId !== senderId);

        const message = new Message({
            senderId,
            receiverId,
            content,
            conversationId,
            createdAt: new Date()
        });
        const savedMessage = await message.save();

        conversation.lastMessageId = savedMessage.id;
        await conversation.save();

        const date = new Date(savedMessage.createdAt);
        return res.status(201).json({
            message: {
                ...savedMessage.toObject(),
                createdAt: formatDateTime(date)
            }
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

messageRouter.get('/messagesByEmail/:email', currentUser, async (req, res) => {
    const userEmail = req.params.email;
    const userId = req.currentUser.id;

    try {
        const otherUser = await User.findOne({ email: userEmail });
        if (!otherUser) {
            return res.status(404).json({ error: 'User not found with the provided email.' });
        }

        const conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUser.id] }
        });
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found.' });
        }

        const messages = await Message.find({ conversationId: conversation.id });
        const responseMessages = [];

        for (const message of messages) {
            const sender = await User.findById(message.senderId);
            const senderEmail = sender.email;
            const date = new Date(message.createdAt);

            responseMessages.push({
                id: message.id,
                createdAt: formatDateTime(date),
                conversationId: conversation.id,
                senderEmail: senderEmail,
                content: message.content
            });
        }
        return res.status(200).json(responseMessages);


    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default messageRouter;