import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({

    clientId:{
        type: String,
        required: true
    },
    coachId:{
        type: String,
        required: true
    },
    statusApplication: {
        type: String,
        required: true
    },
    message:{
        type: String,
        required: false
    }
}, { collection: 'clients' })

const Client = mongoose.model('Client', ClientSchema);

export default Client;