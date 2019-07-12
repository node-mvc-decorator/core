import {Constructor} from "./constructor";
import {RequestMethod} from "../../enums/request-method";
import {errorHandler, requestHandler} from "../../core2";

export class Router {

    constructor(public methodName: string,
                public type: Constructor,
                public path: string[],
                public method: RequestMethod[],
                public consumes: string[],
                public headers: string[],
                public params: string[],
                public produces: string[]) {}
    handler(req, res) {
        try {
            requestHandler(this, req, res);
        } catch (e) {
            console.error(e);
            errorHandler(e, res);
        }
    }
}