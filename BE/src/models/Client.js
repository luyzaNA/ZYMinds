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
    }
}, { collection: 'clients' })

const Client = Mongoose.model('Client', ClientSchema);

export default Client;