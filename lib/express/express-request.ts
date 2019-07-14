import {HttpRequest} from '../beans/http-request';
import * as express from 'express';

export class ExpressRequest extends HttpRequest<express.Request> {
    get body(): any {
        return this.request.body;
    }

    get params(): any {
        return this.request.params;
    }

    get query(): any {
        return this.request.query;
    }

}
