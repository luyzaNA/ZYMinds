import express from "express";
import currentUser from "../middlewares/current-user.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

const messageRouter = express.Router();

messageRouter.post("/send", currentUser, async (req, res) => {
    try {
        const receiver = await User.findOne({ email: req.body.email });
        if (!receiver) {
            return res.status(404).json({ message: `User with that email not found` });
        }

        const newMessage = new Message({
            senderId: req.currentUser.id,
            receiverId: receiver.id,
            content: req.body.content,
            createdAt: Date.now()
        });

        const savedMessage = await newMessage.save();

        const timeElapsed = Math.floor(Date.now() - savedMessage.createdAt) / 1000;
        const minutesElapsed = Math.floor(timeElapsed / 60);

        const date = new Date(savedMessage.createdAt);
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZone: "Europe/Bucharest",
            hour12: false
        };
        const formattedDate = date.toLocaleString("ro-RO", options);

        return res.status(200).json({
            ...savedMessage.toObject(),
            timeElapsed: `${minutesElapsed} minute${minutesElapsed > 1? "s" : ""}`,
            createdAt: formattedDate
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default messageRouter;