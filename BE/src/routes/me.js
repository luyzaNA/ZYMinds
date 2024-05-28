import express from "express";
import currentUser from "../middlewares/current-user.js";
import requireAuth from "../middlewares/require-auth.js";
import NotAuthorizedError from "../errors/not-authorized-errors.js";


const meRouter = express.Router();

meRouter.get('/me', currentUser, requireAuth, (req, res) => {
    if (req.currentUser) {
        res.send(req.currentUser);
    } else {
        throw new NotAuthorizedError();
    }
});
export default meRouter;
