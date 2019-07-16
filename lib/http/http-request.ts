
export abstract class HttpRequest<T = any> {
    constructor(public request: T) {}

    abstract get body(): any;
    abstract get query(): any;
    abstract get params(): any;
    abstract get headers(): any;


}

