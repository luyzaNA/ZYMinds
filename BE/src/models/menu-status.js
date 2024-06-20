import { InvalidParamError } from "../errors/invalid-param-error.js";

class MenuStatusAuthorization {
    constructor(status) {
        this.MENU_STATUS_AUTHORIZATION = ['PROCESSING', 'GENERATED', 'COMPLETED'];

        if (!this.MENU_STATUS_AUTHORIZATION.includes(status)) {
            throw new InvalidParamError('Menu status authorization invalid');
        }

        this.status = status;
    }
    get name() {
        return this.status;
    }
}
export default MenuStatusAuthorization;
