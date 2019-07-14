import {HttpError} from './http-error';

class UnsupportedMediaTypeError extends HttpError {
    constructor(message?: string) {
        super(415, message || 'bad request error');
    }
}

export {UnsupportedMediaTypeError};
