import express from "express";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import currentUser from "../middlewares/current-user.js";
import User from "../models/User.js";
import {formatDateTime} from "../utlis/format-date.js";
import requireAuth from "../middlewares/require-auth.js";
import {body, param} from "express-validator";

const conversationRouter = express.Router();

//initiere convesatie dupa email ul primit in corpul cerererii si userId ul utilizatorului curent
//se cauta un user cu email ul dat
//se cauta o confersatie cu participantii : user curet + user cu email ul dat
//daca nu se gaseste se creeaza una
//se creeaza un mesaj cu id urile paricipantilor, content ul din corpul cererii  si id ul conversatiei create
//se steaza ultimul mesja ca find mesjaul tocmai creat
//se salveaza conversatia
//se formateeaza raspunsul
conversationRouter.post('/initialize/conversation', currentUser, requireAuth, [
    body('email').isEmail().withMessage('Email must be valid'),
    body('content').not().isEmpty().withMessage('Content is required')
], async (req, res) => {
    const {content, email} = req.body;
    const senderId = req.currentUser.id;

    try {
        const receiver = await User.findOne({email});

        if (!receiver) {
            return res.status(404).json({message: `User with email ${email} not found`});
        }

        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiver.id]}
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiver.id]
            });
        }

        const message = new Message({
            senderId,
            receiverId: receiver.id,
            content,
            conversationId: conversation.id,
            createdAt: new Date(),
        });
        await message.save();

        conversation.lastMessageId = message.id;
        await conversation.save();

        const date = new Date(message.createdAt);
        return res.status(200).json({
            ...message.toObject(),
            createdAt: formatDateTime(date)
        });
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

//se cauta conversatiile cu id ul utilizatorului curent
//se parcurge fiecare conversatie si se extrage id ul celuilalt participant
//se salveaza ultimul mesaj cu id ul conversatiei curent  si se sorteaza descrecator
//se compune raspunsul
//se push uie in array
conversationRouter.get('/conversations', currentUser, requireAuth, [
  param('id').not().isEmpty().withMessage('Invalid id')
], async (req, res) => {
    const userId = req.currentUser.id;

    try {
        const conversations = await Conversation.find({participants: userId});
        const responseConversations = [];

        for (const conversation of conversations) {
            const {participants} = conversation;
            const otherParticipantId = participants.find(id => id.toString() !== userId.toString());
            const otherParticipant = await User.findById(otherParticipantId);

            const lastMessage = await Message.findOne({ conversationId: conversation.id }).sort({ createdAt: -1 });
            const date = new Date(lastMessage.createdAt);

            responseConversations.push({
                id: conversation.id,
                otherParticipantEmail: otherParticipant.email,
                lastMessageContent: lastMessage.content,
                createdAt: formatDateTime(date)            });
        }
        return res.status(200).json(responseConversations);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

//se cauta un user cu email ul dat ca parametru
//se cauta conversatia cu particapantii : user curent si user cu email dat
//se extrage ultimul mesaj
//se returneaza conversatia cu datele ei
conversationRouter.get('/conversation/:email', currentUser, requireAuth,[
    param('email').isEmail().withMessage('Email must be valid')
], async (req, res) => {
    const currentUser = req.currentUser;
    const userEmail = req.params.email;

    try {
        const userId = currentUser.id;

        const otherUser = await User.findOne({email: userEmail});

        if (!otherUser) {
            return res.status(404).json({error: 'User not found with the provided email.'});
        }

        const conversation = await Conversation.findOne({
            participants: {$all: [userId, otherUser.id]}
        });

        if (!conversation) {
            return res.status(404).json({error: 'Conversation not found.'});
        }

        const lastMessage = await Message.findById(conversation.lastMessageId);

        if (!lastMessage) {
            return res.status(404).json({error: 'Last message not found.'});
        }

        return res.status(200).json({
            conversationId: conversation.id,
            lastMessage: {
                id: lastMessage.id,
                conversationId: conversation.id,
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                senderId: lastMessage.senderId
            }
        });

    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

export default conversationRouter;
