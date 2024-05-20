export class CustomError extends Error {
    statusCode;
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}
