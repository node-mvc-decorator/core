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
}

export {CoreResponse};

