
export abstract class CoreRequest<T = any> {
    constructor(public request: T) {}

    abstract get body(): any;
    abstract get query(): any;
    abstract get params(): any;
    abstract get headers(): any;


}

