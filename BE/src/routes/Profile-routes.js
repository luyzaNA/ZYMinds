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

profileRouter.get('/profile/:userId', currentUser, requireAuth, async (req, res) => {
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

profileRouter.patch('/rating/update/:coachId', [
    param('coachId').not().isEmpty().withMessage('Invalid profile ID'),
    body('rating').isFloat({min: 1, max: 5}).withMessage('Invalid rating')
], async (req, res) => {
    const {coachId} = req.params;
    const {rating} = req.body;

    try {
        const profile = await Profile.findOne({userId: coachId});

        if (!profile) {
            return res.status(404).json({message: 'Profile not found'});
        }

        profile.rating.push(rating);

        if (profile.rating.length > 0) {
            const totalRatings = profile.rating.reduce((sum, rate) => sum + rate, 0);
            profile.averageRating = totalRatings / profile.rating.length;
        } else {
            profile.averageRating = 0;
        }

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
});

profileRouter.get('/rating/:coachId', currentUser, requireAuth, async (req, res) => {
    const {coachId} = req.params;

    try {
        const profile = await Profile.findOne({userId: coachId});

        if (!profile) {
            return res.status(404).json({message: 'Profile not found'});
        }

        if (profile.rating.length === 0) {
            return res.json({averageRating: 0});
        }

        const ratings = profile.averageRating;

        res.json({ratings});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
});


export default profileRouter;
