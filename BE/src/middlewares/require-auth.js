import NotAuthorizedError from "../errors/not-authorized-errors.js";

export const requireAuth = (req, res, next) => {
    if(!req.currentUser){
        throw new NotAuthorizedError('aefa');
    }
    next();
}

export default requireAuth;