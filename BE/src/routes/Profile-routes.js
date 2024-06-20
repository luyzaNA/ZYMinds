import express from "express";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import currentUser from "../middlewares/current-user.js";
import requireAuth from "../middlewares/require-auth.js";
import {body, param} from "express-validator";

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
        const coaches = await User.find({roles: 'COACH'});
        const coachIds = coaches.map(coach => coach.id);
        const coachProfiles = await Profile.find({userId: {$in: coachIds}});

        res.json(coachProfiles);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


profileRouter.put('/profile/update/:_id', currentUser, requireAuth, async (req, res) => {
    const {_id} = req.params;
    const updateData = req.body;

    try {
        const updatedProfile = await Profile.findOneAndUpdate({_id: _id}, updateData, {new: true});

        if (!updatedProfile) {
            return res.status(404).json({message: 'Profile not found'});
        }
        res.json(updatedProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
});

profileRouter.get('/profile/:userId', async (req, res) => {
    const {userId} = req.params;

    try {
        const profile = await Profile.findOne({userId: userId});

        if (!profile) {
            return res.status(404).json({message: 'Profile not found'});
        }
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
});

profileRouter.patch('/rating/update/:_id', currentUser, requireAuth, [
    param('_id').not().isEmpty().withMessage('Invalid profile ID'),
    body('rating').not().isEmpty().withMessage('Invalid rating')
], async (req, res) => {
    const {_id} = req.params;
    const {rating} = req.body

    try {
        const updateProfileRating = await Profile.findOneAndUpdate({_id: _id}, {rating}, {new: true});

        if (!updateProfileRating) {
            return res.status(404).json({message: 'Profile not found'});
        }
        res.json(updateProfileRating);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
});
export default profileRouter;
