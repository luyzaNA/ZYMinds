import {CustomError} from "./custom-error.js";

export class DatabaseConnectionError extends CustomError {
    constructor(){
        super("Error connecting to database");
        this.statusCode = 500;
    }
}

export default DatabaseConnectionError;