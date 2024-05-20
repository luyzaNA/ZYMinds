import express from "express";

const logOutRouter = express.Router();

logOutRouter.post('/logout', (req, res) => {
    res.send({ logout: true });
});

export default logOutRouter;