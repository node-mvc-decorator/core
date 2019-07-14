import * as express from 'express';
import {HttpResponse} from '../http/http-response';

export class ExpressResponse extends HttpResponse<express.Response> {
    send(body: any): this {
        this.response.send(body);
        return this;
    }

    status(code: number): this {
        this.response.status(code);
        return this;
    }

    type(type: string): this {
        this.response.type(type);
        return this;
    }

}
