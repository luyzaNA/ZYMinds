import { InvalidParamError } from "../errors/invalid-param-error.js";

class ContextFileAuthorization {
    constructor(category) {
        this.CONTEXT_FILE_AUTHORIZATION = ['CERTIFICATE', 'MENU', 'PROFILE'];

        if (!this.CONTEXT_FILE_AUTHORIZATION.includes(category)) {
            throw new InvalidParamError('Context file authorization invalid');
        }

        this.category = category;
    }
    get name() {
        return this.category;
    }
}
export default ContextFileAuthorization;
