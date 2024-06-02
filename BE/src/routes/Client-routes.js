import currentUser from "../middlewares/current-user.js";
import requireAuth from "../middlewares/require-auth.js";
import RoleAuthorization from "../models/role-auhorization.js";
import ContextFileAuthorization from "../models/file-context.js";
import express from "express";
import Client from "../models/Client.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import File from "../models/File.js";

const clientRouter = express.Router();
clientRouter.post("/connect/:coachId", currentUser, requireAuth, async (req, res) => {
    try {
        const clientId = req.currentUser.id;
        const {coachId} = req.params;

        const role = new RoleAuthorization(req.currentUser.roles);
        if (role.name !== "CLIENT") {
            return res.status(403).json({message: "Access denied"});
        }

        const newClientData = {
            clientId, coachId, statusApplication: 'pending', ...req.body
        };

        const newClient = new Client(newClientData);
        await newClient.save();

        return res.status(200).json({newClient});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

clientRouter.get('/application/client', currentUser, requireAuth, async (req, res) => {
    const clientId = req.currentUser.id;
    try {
        const role = new RoleAuthorization(req.currentUser.roles);
        if (role.name !== "CLIENT") {
            return res.status(403).json({message: "Access denied"});
        }

        const client = await Client.findOne({clientId: clientId});
        if (!client) {
            return res.status(404).json({message: 'Client not found'});
        }

        const user = await User.findById(client.coachId);
        const profile = await Profile.findOne({userId: client.coachId});
        const photo = await File.findOne({userId: client.coachId, context: "PROFILE"});

        if (!user || !profile || !photo) {
            return res.status(404).json({message: 'User, Profile or Photo not found'});
        }

        const {statusApplication} = client
        const {fullName} = user;
        const {description, age, price, rating} = profile;
        const {awsLink} = photo;

        res.json({statusApplication, fullName, description, age, price, rating, awsLink});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
});

clientRouter.delete("/delete/connection", currentUser, requireAuth, async (req, res) => {
    try {
        const clientId = req.currentUser.id;
        const {coachId} = req.params;

        const role = new RoleAuthorization(req.currentUser.roles);
        if (role.name !== "CLIENT") {
            return res.status(403).json({message: "Access denied"});
        }
        const deleteConnection = await Client.findOneAndDelete({clientId: clientId});
        if (!deleteConnection) {
            return res.status(404).json({message: 'Client not found'});
        }
        return res.status(200).json(deleteConnection);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
export default clientRouter;