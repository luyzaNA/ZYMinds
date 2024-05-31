import express from "express";
import Profile from "../models/Profile.js";

const profileRouter = express.Router();

profileRouter.get('/profiles', async (req, res) => {
    try {
        const profiles = await Profile.find();
        res.json(profiles);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

profileRouter.put('/profile/update/:userId', async (req, res) => {
    const { userId } = req.params;
    const updateData = req.body;

    try {
        const updatedProfile = await Profile.findOneAndUpdate({ userId: userId }, updateData, { new: true });

        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(updatedProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

profileRouter.get('/profile/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const profile = await Profile.findOne({ userId: userId });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
export default profileRouter;
