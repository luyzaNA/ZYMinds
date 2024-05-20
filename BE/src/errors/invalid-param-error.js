import { CustomError}  from './custom-error.js';

export class InvalidParamError extends CustomError {

    constructor() {
        super('Invalid param');
        this.statusCode = 400;
    }
}

export default InvalidParamError;