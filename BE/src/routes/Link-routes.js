import currentUser from "../middlewares/current-user.js";
import requireAuth from "../middlewares/require-auth.js";
import RoleAuthorization from "../models/role-auhorization.js";
import express from "express";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import File from "../models/File.js";
import Link from "../models/Link.js";
import {body, param} from "express-validator";

const linkRouter = express.Router();
linkRouter.post("/connect/:coachId", currentUser, requireAuth, [
    body('message').not().isEmpty().withMessage('Message is required'),
], async (req, res) => {
    try {
        const clientId = req.currentUser.id;
        const {coachId} = req.params;

        const role = new RoleAuthorization(req.currentUser.roles);
        if (role.name !== "CLIENT") {
            return res.status(403).json({message: "Access denied"});
        }
        const links = await Link.find({clientId: req.currentUser.id});
        for(const link of links){
            if((await link).statusApplication === 'approved'){
                return res.status(400).json({message: 'You already have a approved application'});
            }
        }
        const newLinkData = {
            clientId, coachId, statusApplication: 'pending', ...req.body
        };
        const newLink = new Link(newLinkData);
        await newLink.save();

        return res.status(200).json({newLink});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

linkRouter.get('/application/client', currentUser, requireAuth, async (req, res) => {
    const clientId = req.currentUser.id;
    try {
        const role = new RoleAuthorization(req.currentUser.roles);
        if (role.name !== "CLIENT") {
            return res.status(403).json({message: "Access denied"});
        }

        const link = await Link.find({clientId: clientId});
        if (link.length === 0) {
            return res.status(404).json({message: 'Link not found'});
        }
        let linkDetails = [];
        for(const l of link){
            const user = await User.findById(l.coachId);
            const profile = await Profile.findOne({userId: l.coachId});
            const photo = await File.findOne({userId: l.coachId, context: "PROFILE"});

            if (!user || !profile || !photo) {
                console.log('User, Profile or Photo not found');
                continue;
            }

            const {statusApplication, id} = l
            const {fullName} = user;
            const {description, age, price, rating} = profile;
            const {awsLink} = photo;
            linkDetails.push({statusApplication, fullName, userId: user.id, description, age, price, rating, awsLink, id});
        }
        res.json(linkDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
});

linkRouter.delete("/delete/connection/:id", currentUser, requireAuth,[
    param('linkId').not().isEmpty().withMessage('Link id is required'),
], async (req, res) => {
    try {
        const {linkId} = req.params;

        const role = new RoleAuthorization(req.currentUser.roles);
        if (role.name !== "CLIENT") {
            return res.status(403).json({message: "Access denied"});
        }
        const deleteConnection = await Link.findOneAndDelete({id: linkId});
        if (!deleteConnection) {
            return res.status(404).json({message: 'Link not found'});
        }
        return res.status(200).json({id: deleteConnection.id});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

linkRouter.get('/clients', currentUser, requireAuth, async (req, res) => {
    try {
        const coachId = req.currentUser.id;

        const role = new RoleAuthorization(req.currentUser.roles);
        if (role.name !== "COACH") {
            return res.status(403).json({message: "Access denied"});
        }

        const links = await Link.find({coachId});
        const linkDetails = [];

        for (const link of links) {
            const linkDetail = {};
            linkDetail.status = link.statusApplication;
            linkDetail.message = link.message;
            linkDetail.clientId = link.clientId;
            linkDetail.id = link.id;

            const user = await User.findById(link.clientId);
            if (user) {
                linkDetail.email = user.email;
                linkDetail.fullName = user.fullName;
                linkDetail.phoneNumber = user.phoneNumber;
            }

            const profile = await Profile.findOne({userId: link.clientId});
            if (profile) {
                linkDetail.age = profile.age;
            }

            const photo = await File.findOne({userId: link.clientId});
            if (photo) {
                linkDetail.awsLink = photo.awsLink;
            } else {
                linkDetail.awsLink = "https://zyminds-upload-files.s3.eu-central-1.amazonaws.com/profile.png";
            }

            linkDetails.push(linkDetail);
        }
        return res.status(200).json(linkDetails);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

linkRouter.patch('/update/status/client/:clientId', currentUser, requireAuth,[
    body('statusApplication').not().isEmpty().withMessage('Status is required'),
    param('clientId').not().isEmpty().withMessage('Client id is required')
], async (req, res) => {
    const {clientId} = req.params;
    const {statusApplication} = req.body

    try {
        const role = new RoleAuthorization(req.currentUser.roles);

        if (role.name !== "COACH") {
            return res.status(403).json({message: "Access denied"});
        }

        const updateLinkStatus = await Link.findOneAndUpdate({clientId: clientId}, {statusApplication: statusApplication}, {new: true});
        if (!updateLinkStatus) {
            return res.status(404).json({message: 'Link not found'});
        }

        res.json(updateLinkStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
});

export default linkRouter;