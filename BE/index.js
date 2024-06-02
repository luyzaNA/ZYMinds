import express from 'express';
import connectDB from './src/db/conn.js';
import foodRoutes from './src/routes/Food-routes.js';
import userRouter from './src/routes/Register-routes.js';
import fileRouter from './src/routes/File-routes.js';
import cors from 'cors';
import userRouterLog from "./src/routes/Login-routes.js";
import dotenv from 'dotenv';
import errorHandler from "./src/middlewares/error-handler.js";
import logOutRouter from "./src/routes/logout.js";
import meRouter from "./src/routes/me.js";
import profileRouter from "./src/routes/Profile-routes.js";
import clientRouter from "./src/routes/Client-routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use(cors());

app.use(foodRoutes);
app.use(userRouter);
app.use(fileRouter);
app.use(userRouterLog);
app.use(errorHandler);
app.use(logOutRouter);
app.use(meRouter);
app.use(profileRouter);
app.use(clientRouter);
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Allow-Origin');
    res.setHeader('Access-Control-Allow-Credentials', "true");
    next();
});
connectDB().then(() => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT-SECRET not specified');
    }
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});