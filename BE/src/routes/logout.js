import express from "express";
import currentUser from "../middlewares/current-user.js";
import requireAuth from "../middlewares/require-auth.js";

const logOutRouter = express.Router();

logOutRouter.post('/logout', currentUser, requireAuth, (req, res) => {
    res.send({logout: true});
});

export default logOutRouter;