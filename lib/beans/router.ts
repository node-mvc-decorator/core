import {Constructor} from "./constructor";
import {RequestMethod} from "../enums/request-method";
import {errorHandler, requestHandler} from "../core";

export class Router {

    constructor(public methodName: string,
                public type: Constructor,
                public path: string[],
                public method: RequestMethod[],
                public consumes: string[],
                public headers: string[],
                public params: string[],
                public produces: string[]) {}
    handler(req: any, res: any) {
        try {
            requestHandler(this, req, res);
        } catch (e) {
            console.error(e);
            errorHandler(e, res);
        }
    }
}