import express from "express";
import currentUser from "../middlewares/current-user.js";
import Link from "../models/Link.js";
import Prerequisites from "../models/Prerequisites.js";
import Profile from "../models/Profile.js";
import requireAuth from "../middlewares/require-auth.js";
import RoleAuthorization from "../models/role-auhorization.js";
import {body, param} from "express-validator";

const prerequisitesRouter = express.Router();

prerequisitesRouter.post('/create/prerequisites', currentUser,requireAuth,[
    body('weight').not().isEmpty().withMessage('Weight is required'),
    body('height').not().isEmpty().withMessage('Height is required'),
    body('target').not().isEmpty().withMessage('Target is required'),
    body('intolerances').not().isEmpty().withMessage('Intolerances is required'),
    body('activityLevel').not().isEmpty().withMessage('Activity level is required'),
    body('gender').not().isEmpty().withMessage('Gender is required'),
    body('mainMealsCount').not().isEmpty().withMessage('Main meals count is required'),
    body('secondaryMealsCount').not().isEmpty().withMessage('Secondary meals count is required'),
], async (req, res) => {
    const {id} = req.currentUser;
    const {weight, height, target, intolerances, activityLevel, gender, mainMealsCount, secondaryMealsCount} = req.body
    try {
        const role = new RoleAuthorization(req.currentUser.roles);
        if (role.name !== "CLIENT") {
            return res.status(403).json({message: "Access denied"});
        }

        const link = await Link.findOne({clientId: id});
        if (!link) {
            return res.status(404).json({message: 'Link not found'});
        }

        const profile = await Profile.findOne({userId: id})
        if (!profile) {
            return res.status(404).json({message: 'Profile not found'});
        }

        const newPrerequisites = new Prerequisites({
            weight, height, target, intolerances, activityLevel, gender, mainMealsCount, secondaryMealsCount, linkId: link.id, id
        })

        const savedPrerequisites = await newPrerequisites.save();
        const result = savedPrerequisites.toJSON();
        result.age = profile.age;

        return res.status(201).json(result);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

prerequisitesRouter.get('/prerequisites/:linkId', currentUser, requireAuth,[
    param('linkId').not().isEmpty().withMessage('Invalid link ID'),
], async (req, res) => {
    const {linkId} = req.params;
    try {
        const prerequisites = await Prerequisites.findOne({linkId:linkId});

        if (!prerequisites) {
            return res.status(404).json({message: 'Prerequisites not found'});
        }

        const link = await Link.findById(linkId);
        if (!link) {
            return res.status(404).json({message: 'Link not found'});
        }
        const profile = await Profile.findOne({userId: link.clientId});
        if (!profile) {
            return res.status(404).json({message: 'Profile not found'});
        }

        const result = prerequisites.toJSON();
        result.age = profile.age;

        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

prerequisitesRouter.put('/update/prerequisites/:id', currentUser,requireAuth, [
    param('id').not().isEmpty().withMessage('Invalid prerequisites ID'),
    body('weight').not().isEmpty().withMessage('Weight is required'),
    body('height').not().isEmpty().withMessage('Height is required'),
    body('target').not().isEmpty().withMessage('Target is required'),
    body('intolerances').not().isEmpty().withMessage('Intolerances is required'),
    body('activityLevel').not().isEmpty().withMessage('Activity level is required'),
    body('gender').not().isEmpty().withMessage('Gender is required'),
    body('age').not().isEmpty().withMessage('Age is required'),
    body('mainMealsCount').not().isEmpty().withMessage('Main meals count is required'),
    body('secondaryMealsCount').not().isEmpty().withMessage('Secondary meals count is required')
], async (req, res) => {
    const {id} = req.params;
    const {weight, height, target, intolerances, activityLevel, gender, age, mainMealsCount,secondaryMealsCount} = req.body;

    try {
        const role = new RoleAuthorization(req.currentUser.roles);
        if (role.name !== "CLIENT") {
            return res.status(403).json({message: "Access denied"});
        }

        const updatePrerequisites = await Prerequisites.findByIdAndUpdate(id,
            {weight, height, target, intolerances, activityLevel, gender, mainMealsCount, secondaryMealsCount },
            {new: true}
        );
        if (!updatePrerequisites) {
            return res.status(404).json({message: 'Prerequisites not found'});
        }

        const profile = await Profile.findOneAndUpdate(
            {userId: req.currentUser.id},
            {age: age},
            {new: true}
        );
        if (!profile) {
            return res.status(404).json({message: 'Profile not found'});
        }

        const result = updatePrerequisites.toJSON();
        result.age = profile.age;

        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

export default prerequisitesRouter;


