import {Controller, GetMapping} from './lib/decorators/index';
import {bootstrap} from './lib/express/bootstrap';
import {ExpressRequest} from './lib/express/express-request';
import {ExpressResponse} from './lib/express/express-response';


@Controller
export class A {

    @GetMapping
    testGet(req: ExpressRequest) {
        console.log(req.request.headers);
        console.log(123231123);

        return 'asdfadsf';
    }

    @GetMapping({path: '/', params: 'b'})
    testGet2(res: ExpressResponse) {
        console.log(222222222);
        return 'aaaa';
    }

}

bootstrap(A).listen(3000, () => console.log('启动成功'));


