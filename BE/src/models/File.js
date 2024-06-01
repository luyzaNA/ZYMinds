import mongoose from "mongoose";
import ContextFileAuthorization from "./file-context.js";

const FileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    awsLink: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: false
    },
    size: {
        type: Number,
        required: true
    },
    context: {
        type: String,
        required: true
    },
    awsSecretKey:{
        type: String,
        required: true
   }
}, { collection: 'files' });

const File = mongoose.model('File', FileSchema);

export default File;
