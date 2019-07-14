


class HttpError extends Error {
    constructor(public status: number,
                public message: string) {
        super(message);
    }
}

export {HttpError};
