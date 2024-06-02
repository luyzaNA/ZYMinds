import {Mongoose} from "mongoose";

const ClientSchema = new MongooseSchema({

    userId:{
        type: String,
        required: true
    },
    coachId:{
        type: String,
        required: true
    },
    statusApplication: {
        type:  ['pending', 'approved', 'rejected'],
        required: true
    },
    message:{
        type: String,
        required: false
    }
}, { collection: 'clients' })

const Client = Mongoose.model('Client', ClientSchema);

export default Client;