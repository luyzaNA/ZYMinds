import {CustomError} from "./custom-error.js";

export class NotAuthorizedError extends CustomError {
    constructor() {
        super('Not Authorized');
        this.statusCode=401;
    }
}
export default NotAuthorizedError;