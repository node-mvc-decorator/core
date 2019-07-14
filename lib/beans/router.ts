import {Constructor} from "./constructor";
import {RequestMethod} from "../enums/request-method";
import {errorHandler, requestHandler} from "../core";
import {HttpRequest} from './http-request';
import {HttpResponse} from './http-response';

// export class Router {
//
//     constructor(public methodName: string,
//                 public type: Constructor,
//                 public path: string[],
//                 public method: RequestMethod[],
//                 public consumes: string[],
//                 public headers: string[],
//                 public params: string[],
//                 public produces: string[]) {}
//     handler(req: HttpRequest, res: HttpResponse) {
//         try {
//             requestHandler(this, req, res);
//         } catch (e) {
//             console.error(e);
//             errorHandler(e, res);
//         }
//     }
// }
export interface Router {
    path: string;
    method: RequestMethod;
    consumes: string[];
    headers: string[];
    params: string[];
    produces: string[];
    type: Constructor;
    methodName: string;
}
