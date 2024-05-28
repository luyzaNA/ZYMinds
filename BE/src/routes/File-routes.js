import express from 'express';
import multer from 'multer';
import File from '../models/File.js';
import AWS from '../db/aws-config.js';
import ContextFileAuthorization from "../models/file-context.js";

const fileRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

fileRouter.post('/upload', upload.single('file'), async (req, res) => {
    try {

        console.log(req.body.fileData);
        const { userId, context } = JSON.parse(req.body.fileData);
        const { originalname, mimetype, buffer } = req.file;

        const contextAuth = new ContextFileAuthorization(context);

        const s3 = new AWS.S3();
        const params = {
            Bucket: 'zyminds-upload-files',
            Key: originalname,
            Body: buffer,
            context: contextAuth.name
        };

        const uploadedFile = await s3.upload(params).promise();

        const newFile = await File.create({
            userId,
            awsLink: uploadedFile.Location,
            filename: originalname,
            mimetype,
            size: buffer.length,
            context: context
        });

        res.status(201).json({ message: 'Fișier încărcat cu succes!', fileId: newFile._id, awsLink: uploadedFile.Location });
    } catch (error) {
        console.error('Eroare la încărcare fișier:', error);
        res.status(500).json({ message: 'Eroare la încărcare fișier!' });
    }
});

fileRouter.get('/upload', async (req, res) => {
    try {
        const files = await File.find();
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

fileRouter.get('/files/:userId/:context', async (req, res) => {
    try {
        const { userId, context } = req.params;

        if (!userId || !context) {
            return res.status(400).json({ message: 'userId și context sunt necesare' });
        }

        const contextAuth = new ContextFileAuthorization(context);

        const files = await File.find({ userId, context: contextAuth.name });

        res.status(200).json(files);
    } catch (error) {
        if (error instanceof InvalidParamError) {
            return res.status(400).json({ message: error.message });
        }
        console.error('Eroare la obținerea fișierelor:', error);
        res.status(500).json({ message: 'Eroare la obținerea fișierelor!' });
    }
});

export default fileRouter;
