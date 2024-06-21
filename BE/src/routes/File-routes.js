import express from 'express';
import multer from 'multer';
import File from '../models/File.js';
import AWS from '../db/aws-config.js';
import ContextFileAuthorization from "../models/file-context.js";
import {v4 as uuiv4} from 'uuid';
import currentUser from "../middlewares/current-user.js";
import requireAuth from "../middlewares/require-auth.js";
import {param} from "express-validator";


const fileRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage});

fileRouter.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const {userId, context} = JSON.parse(req.body.fileData);
        const {originalname, mimetype, buffer} = req.file;
        const awsSecretKey = uuiv4();

        const contextAuth = new ContextFileAuthorization(context);

        const s3 = new AWS.S3();
        const params = {
            Bucket: 'zyminds-upload-files',
            Key: awsSecretKey,
            Body: buffer,
        };

        const uploadedFile = await s3.upload(params).promise();

        const newFile = await File.create({
            userId,
            awsLink: uploadedFile.Location,
            filename: originalname,
            mimetype,
            size: buffer.length,
            context: contextAuth.name,
            awsSecretKey: awsSecretKey
        });

        console.log('Fișierul a fost încărcat cu succes:', newFile);
        res.status(201).json({
            message: 'Fișier încărcat cu succes!',
            fileId: newFile._id,
            awsLink: uploadedFile.Location
        });
    } catch (error) {
        console.error('Eroare la încărcare fișier:', error);
        res.status(500).json({message: 'Eroare la încărcare fișier!'});
    }
});

fileRouter.get('/upload', currentUser, requireAuth, async (req, res) => {
    try {
        const files = await File.find();
        res.json(files);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

fileRouter.get('/files/:userId/:context',[
    param('userId').isMongoId().withMessage('userId invalid'),
    param('context').isString().withMessage('context invalid')
], async (req, res) => {
    try {
        const {userId, context} = req.params;

        if (!userId || !context) {
            return res.status(400).json({message: 'userId și context sunt necesare'});
        }

        const contextAuth = new ContextFileAuthorization(context);

        const files = await File.find({userId, context: contextAuth.name});

        res.status(200).json(files);
    } catch (error) {
        if (error instanceof InvalidParamError) {
            return res.status(400).json({message: error.message});
        }
        console.error('Eroare la obținerea fișierelor:', error);
        res.status(500).json({message: 'Eroare la obținerea fișierelor!'});
    }
});

fileRouter.put('/files/update/:id', upload.single('file'), currentUser, requireAuth, async (req, res) => {
    try {
        const _id = req.params.id;
        const {originalname, mimetype, buffer} = req.file;

        const deleteFile = await File.findById(_id);

        const s3 = new AWS.S3();

        const params = {
            Bucket: 'zyminds-upload-files',
            Key: deleteFile.awsSecretKey
        };
        s3.deleteObject(params, async (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error deleting file from S3');
            }

            const awsSecretKey = uuiv4();
            const uploadParams = {
                Bucket: 'zyminds-upload-files',
                Key: awsSecretKey,
                Body: buffer
            };

            const uploadedFile = await s3.upload(uploadParams).promise();

            const updateFile = await File.findByIdAndUpdate(_id,
                {
                    awsLink: uploadedFile.Location,
                    filename: originalname,
                    mimetype,
                    size: buffer.length,
                    awsSecretKey: awsSecretKey
                }, {new: true})

            res.status(201).json({
                message: 'Fișier încărcat cu succes!',
                fileId: updateFile._id,
                awsLink: uploadedFile.Location
            });

        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export default fileRouter;