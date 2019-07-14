import {resolveRoute, resolveRouter} from '../core';
import {Constructor} from "../beans/constructor";
import express = require("express");
import {ExpressRequest} from './express-request';
import {ExpressResponse} from './express-response';

export function bootstrap(...constructors: Array<Constructor>): express.Express {
    const app = express()
        .use(express.json())
        .use(express.urlencoded({ extended: true }));

    resolveRouter(constructors, (path, method, hanlder) =>
        app[method](path, (req, res) => hanlder(new ExpressRequest(req), new ExpressResponse(res))));
    return app;
}
