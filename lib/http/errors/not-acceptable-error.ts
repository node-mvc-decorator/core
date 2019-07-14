import {HttpError} from "./http-error";


export class NotAcceptableError extends HttpError {
    constructor(message?: string) {
        super(406, message || 'not found error');
    }
}
