import jwt from "jsonwebtoken";
import notAuthorizedErrors from "../errors/not-authorized-errors.js";

const currentUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.currentUser = payload;
        } catch (err) {
            throw  new notAuthorizedErrors();
        }
    } else {
        throw  new notAuthorizedErrors();
    }
    next();
};

export default currentUser;
