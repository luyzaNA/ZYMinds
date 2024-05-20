import { CustomError }  from "../errors/custom-error.js";

const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }

    res.status(400).send({
        errors: [
            { message: 'Something went wrong!' }
        ]
    });
};

export default errorHandler;