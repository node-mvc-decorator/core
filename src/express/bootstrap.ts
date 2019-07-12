import {resolveRoute} from "../core2";
import {Constructor} from "../beans/common/constructor";
import * as express from "express";

export function bootstrap(...constructors: Array<Constructor>) {
    const app = express()
        .use(express.json())
        .use(express.urlencoded({ extended: true }));
    resolveRoute(constructors).forEach(route => {
        route.path.forEach(path => {
            route.method.forEach(method => {
                app[method](path, (req, res) => route.handler(req, res));
            });
        });
    });
    return app;
}