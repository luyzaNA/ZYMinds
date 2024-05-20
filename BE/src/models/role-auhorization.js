import { InvalidParamError } from "../errors/invalid-param-error.js";

class RoleAuthorization {
    constructor(category) {
        this.GROUP_AUTHORIZATION_CHOICES = ['CLIENT', 'COACH', 'ADMIN'];

        if (!this.GROUP_AUTHORIZATION_CHOICES.includes(category)) {
            throw new InvalidParamError('Group authorization invalid');
        }

        this.category = category;
    }
    get name() {
        return this.category;
    }
}

export default RoleAuthorization;
