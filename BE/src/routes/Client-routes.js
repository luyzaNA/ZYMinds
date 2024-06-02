import currentUser from "../middlewares/current-user.js";
import requireAuth from "../middlewares/require-auth.js";
import RoleAuthorization from "../models/role-auhorization.js";
import express from "express";
import Client from "../models/Client.js";
import Profile from "../models/Profile.js";
import profileRouter from "./Profile-routes.js";

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
            clientId,
            coachId,
            statusApplication: 'pending',
            ...req.body
        };

        const newClient = new Client(newClientData);
        await newClient.save();

        return res.status(200).json({newClient});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

clientRouter.get('/application/client/:clientId', currentUser, requireAuth, async (req, res) => {
    const clientId = req.currentUser.id;

    try {
        const role = new RoleAuthorization(req.currentUser.roles);
        if (role.name !== "CLIENT") {
            return res.status(403).json({ message: "Access denied" });
        }
        const client = await Client.findOne({clientId: clientId});

        if (!client) {
            return res.status(404).json({message: 'Client not found'});
        }
        res.json(client);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
});
export default clientRouter;