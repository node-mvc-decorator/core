import {HttpError} from './http-error';

class UnsupportedMediaTypeError extends HttpError {
    constructor(message?: string) {
        super(415, message || 'unsupported media type');
    }
}

export {UnsupportedMediaTypeError};
