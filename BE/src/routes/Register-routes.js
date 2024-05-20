import express from 'express';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';
import { Password } from '../services/Password.js';
import  BadRequestError from '../errors/bad-request-error.js'
import jwt from 'jsonwebtoken'
import RoleAuhorization from "../models/role-auhorization.js";
import validateRequest from "../middlewares/validate-request.js";
import RoleAuthorization from "../models/role-auhorization.js";
const userRouter = express.Router();

userRouter.post("/users/create", [
    body('email')
        .isEmail()
        .withMessage('Email must be provided')
        .normalizeEmail(),
    body('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name must be provided'),
    body('phoneNumber')
        .trim()
        .isNumeric()
        .withMessage('Phone number must be numeric')
        .notEmpty()
        .withMessage('Phone number must be provided'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
],
    validateRequest,
     async (req, res) => {
        const errors = validationResult(req);
        const {email, fullName, phoneNumber, password} = req.body;
    try {

        const existingUser = await User.findOne({email});
            if (existingUser) {
                throw new BadRequestError("User already exists");
            }

            const hashedPassword = await Password.toHash(req.body.password);

            const newUser = new User({
                email: req.body.email,
                fullName: req.body.fullName,
                phoneNumber: req.body.phoneNumber,
                password: hashedPassword,
                roles: new RoleAuhorization('CLIENT').category,
                newCoach: false
            });

            const savedUser = await newUser.save();
            const userJwt = jwt.sign({
                id: newUser.id,
                email: newUser.email,
                fullName: newUser.fullName,
                phoneNumber: newUser.phoneNumber,
                roles: newUser.roles,
                newCoach: newUser.newCoach
            },
                process.env.JWT_SECRET)

        res.status(201).send(newUser);
        // res.status(201).send({token: userJwt});
        } catch (error) {
            res.status(400).json({message: error.message});
        }
    }
);



userRouter.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

userRouter.get('/users/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const users = await User.findById({_id});
        if(!users){
            return res.status(404).json({ message: `User with id ${_id} not found` });
        }
        return res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


userRouter.patch('/users/new/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { newCoach } = req.body;
        const updateUsers = await User.findByIdAndUpdate(id, { newCoach }, { new: true });
        if (!updateUsers) {
            return res.status(404).json({ message: `User with id ${id} not found` });
        }
        return res.status(200).json(updateUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//update
userRouter.patch('/users/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const body = req.body;
        new RoleAuthorization(req.body.roles);
        const updateUsers = await User.findByIdAndUpdate(_id, body, {new:true});
        if(!updateUsers){
            return res.status(404).json({ message: `User with id ${_id} not found` });
        }
        return res.status(200).json(updateUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

userRouter.delete('/users/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const deleteUsers = await User.findByIdAndDelete({_id});
        if(!deleteUsers){
            return res.status(404).json({ message: `User with id ${_id} not found` });
        }
        return res.status(200).json(deleteUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default userRouter;
