import express from 'express';
import { body, validationResult } from 'express-validator';
import { Password } from '../services/Password.js';
import User from '../models/User.js';
import validateRequest from "../middlewares/validate-request.js";
import BadRequestError from "../errors/bad-request-error.js";
import jwt from "jsonwebtoken";

const userRouterLog = express.Router();

userRouterLog.post("/login",
    [
        body('email').
            isEmail()
            .withMessage('Email must be provided')
            .normalizeEmail(),
        body('password')
            .notEmpty()
            .withMessage('Password must be provided')
    ],
    validateRequest, async (req, res) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        try {
            if (!existingUser) {
                throw new BadRequestError("Invalid credentials");
            }

            const passwordMatch = await Password.compare(existingUser.password, password);
            if (!passwordMatch) {
                throw new BadRequestError();
            }

            const userJwt = jwt.sign({
                    id: existingUser.id,
                    email: existingUser.email,
                    fullName: existingUser.fullName,
                    phoneNumber: existingUser.phoneNumber,
                    roles: existingUser.roles
                },
                process.env.JWT_SECRET
            );
            res.status(200).send({token: userJwt});
        }catch(error) {
            res.status(400).json({message: error.message});
        }
});

export default userRouterLog;
