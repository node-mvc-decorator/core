export abstract class HttpRequest<T = any> {
    constructor(protected request: T) {}

    abstract get body(): any;
    abstract get query(): any;
    abstract get params(): any;


}
