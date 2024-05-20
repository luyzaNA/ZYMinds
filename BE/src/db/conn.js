import mongoose from 'mongoose';
import DatabaseConnectionError from "../errors/database-connection-error.js";


const connectDB = async () => {
    try {
      await mongoose.connect(process.env.DB_URL);
      console.log('Connected to MongoDB Atlas');
    } catch (error) {
        throw new DatabaseConnectionError();
    }
  };
  export default connectDB;