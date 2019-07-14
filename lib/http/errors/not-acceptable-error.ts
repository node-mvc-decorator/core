import {HttpError} from "./http-error";


class NotAcceptableError extends HttpError {
    constructor(message?: string) {
        super(406, message || 'not found error');
    }
}

export {NotAcceptableError};
