import express from "express";
import currentUser from "../middlewares/current-user.js";
import requireAuth from "../middlewares/require-auth.js";


const meRouter = express.Router();

meRouter.get('/me', currentUser, requireAuth, (req, res) => {
    res.send({...req.currentUser || null});
});
export default meRouter;
