import {HttpError} from "./http-error";


export class InternalServiceError extends HttpError {
    constructor(message?: string) {
        super(500, message || 'internal service error');
    }
}
