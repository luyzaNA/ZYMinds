import express from 'express';
import multer from 'multer';
import File from '../models/File.js';
import AWS from '../db/aws-config.js';

const fileRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

fileRouter.post('/upload', upload.single('file'), async (req, res) => {
    try {
        console.log(req.body.fileData);
        const { userId } = JSON.parse(req.body.fileData);
        const { originalname, mimetype, buffer } = req.file;

        const s3 = new AWS.S3();
        const params = {
            Bucket: 'zyminds-upload-files',
            Key: originalname,
            Body: buffer
        };

        const uploadedFile = await s3.upload(params).promise();

        const newFile = await File.create({
            userId,
            awsLink: uploadedFile.Location,
            filename: originalname,
            mimetype,
            size: buffer.length
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


fileRouter.get('/files', async (req, res) => {
    try {
        const userId = req.query.userId;

        const files = await File.find({ userId });
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export default fileRouter;
