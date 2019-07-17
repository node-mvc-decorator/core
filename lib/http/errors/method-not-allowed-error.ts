import {HttpError} from "./http-error";


class MethodNotAllowedError extends HttpError {
    constructor(message?: string) {
        super(405, message || 'method not allowed');
    }
}

export {MethodNotAllowedError};
