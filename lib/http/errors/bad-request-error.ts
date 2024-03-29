import {HttpError} from "./http-error";


class BadRequestError extends HttpError {
    constructor(message?: string) {
        super(400, message || 'bad request');
    }
}
export {BadRequestError};
