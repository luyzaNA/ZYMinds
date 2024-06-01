import express from "express";
import Profile from "../models/Profile.js";
import User from "../models/User.js";

const profileRouter = express.Router();

profileRouter.get('/profiles', async (req, res) => {
    try {
        const profiles = await Profile.find();
        res.json(profiles);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


profileRouter.get('/profiles/coach', async (req, res) => {
    try {
        const coaches = await User.find({ roles: 'COACH' });
        const coachIds = coaches.map(coach => coach.id);
        const coachProfiles = await Profile.find({ userId: { $in: coachIds } });

        res.json(coachProfiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


profileRouter.put('/profile/update/:_id', async (req, res) => {
    const { _id } = req.params;
    const updateData = req.body;

    try {
        const updatedProfile = await Profile.findOneAndUpdate({ _id: _id }, updateData, { new: true });

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
