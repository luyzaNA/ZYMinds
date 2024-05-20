import { CustomError } from './custom-error.js';

export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(errors) {
        super('Invalid request parameters');
        this.errors = errors;
    }
}

export default RequestValidationError;
