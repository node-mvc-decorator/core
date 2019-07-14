import {HttpError} from './http-error';

export class UnsupportedMediaTypeError extends HttpError {
    constructor(message?: string) {
        super(415, message || 'bad request error');
    }
}
