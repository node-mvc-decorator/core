// this
abstract class CoreResponse<T = any>  {
    constructor(public response: T) {}
    /**
     * 设置状态
     * @param code
     */
    abstract status(code: number): this;

    abstract send(body: any): this;

    abstract type(type: string): this;

    abstract end(): this;

    abstract setHeader(name: string, value: number | string | string[]): this;
    abstract removeHeader(name: string): this;
    abstract getHeader(name: string): number | string | string[] | undefined;
    abstract getHeaders(): any;
}

export {CoreResponse};


