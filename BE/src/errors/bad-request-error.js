import { CustomError}  from './custom-error.js';

export class BadRequestError extends CustomError {
    constructor(message = 'Bad Request') {
        super(message);
        this.statusCode = 400;
    }
}

export default BadRequestError;