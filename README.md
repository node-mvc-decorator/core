# 提供一套类似 java spring mvc风格注解的 装饰器

## 安装

```bash
npm i @node-mvc-decorator/core -s
```
这里只是一个注解的api需要接入相关服务器框架 如express 

目前已经用express实现 请看 @node-mvc-decorator/express


如

```typescript
// 写法和spring mvc差不多 声明bean可以使用@Service @Service() @Service({name: 'service3'})
@Service
export class Service1 {}

@Service()
export class Service2 {}

@Service({name: 'service3'})
export class Service3 {}

// RequestMapping注册可以在类上和方法上使用 与spring mvc一致 包括 params products等参数
@Controller
@RequestMapping({path: '/test', method: [RequestMethod.GET, RequestMethod.POST]})
export class Controller {
    
    // 因为js不可以得到属性的类型所以需要指定type来注入
    @Autowired({type: Service1})
    service1: Service1;
    
    // 第二种注入 通过构造器注入 这里可以通过类型注入
    constructor(public service2: Service2) {}

    // 可以使用类型进行方法参数注入
    @GetMapping('/get')
    testGet1(res: HttpRequest, req: HttpResponse) {return {a: 'testGet1'}}
    
    // 可以使用@RequestParam 跟据参数名字注入 参数会变成指定类型
    @GetMapping({path: '/get', params: 'param1=test1'})
    testGet2(@RequestParam('a') a: string, @RequestParam({name: 'b', required: true}) b: string) {return {a: 'testGet2'}}
    
    @RequestMapping('/post')
    testPost() {return {a: 'testPost'}}
    
    @RequestMapping({path: '/post', params: ['param1', 'param2!=test2'], headers: ['header1=2']})
    testPost2() {return {a: 'testPost2'}}

}
```


## 实现接口的上步聚 （需要三步）

可以参照@node-mvc-decorator/express来实现

### 一 需要写一个包装服务框架请求的request类 实现HttpRequest里的方法

继承下面这个抽象类 实现其中的方法
```typescript
export abstract class HttpRequest<T = any> {
    constructor(public request: T) {}
    abstract get body(): any;
    abstract get query(): any;
    abstract get params(): any;
    abstract get headers(): IncomingHttpHeaders;
}
```

如在：
```typescript
import * as express from 'express';
// 这里的request就是express.Request类型的数据 Express中的request 使用了@types/express来写类型
export class ExpressRequest extends HttpRequest<express.Request> {
    get headers(): IncomingHttpHeaders {
        return this.request.headers;
    }
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
```

### 二、需要写一个包装服务框架请求的response类 实现HttpResponse里的方法


继承下面这个抽象类 实现其中的方法
```typescript
export abstract class HttpResponse<T = any>  {
    constructor(public response: T) {}
    /**
     * 设置状态
     * @param code
     */
    abstract status(code: number): this;
    
    abstract send(body: any): this;

    abstract type(type: string): this;
}
```

如：
```typescript
import * as express from 'express';

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
```

### 三、实现一个启动服务的方法 比如：

```typescript
import * as express from 'express';
import {Constructor, resolveRouter} from '@node-mvc-decorator/core';
export function bootstrap(...constructors: Array<Constructor>): express.Express {
    const app = express()
        .use(express.json())
        .use(express.urlencoded({ extended: true }));

    resolveRouter(constructors, (path, method, hanlder) =>
        // 这里就是express加载路由的写法
        app[method](path, (req, res) => hanlder(new ExpressRequest(req), new ExpressResponse(res))));
    return app;
}
```

上面的应用的例子是如何启动的呢
使用
```typescript
// 多个controller就写多个这里只有一个 bootstrap只是解析出路由  返回的还是Express对象
bootstrap(Controller).listen(3000, () => console.log('启动成功'));
```

## 全用@node-mvc-decorator/express实现 的一个简单demo

@node-mvc-decorator/express-demo
