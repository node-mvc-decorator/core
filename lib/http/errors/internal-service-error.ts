import {HttpError} from "./http-error";


class InternalServiceError extends HttpError {
    constructor(message?: string) {
        super(500, message || 'internal service error');
    }
}

export {InternalServiceError};
