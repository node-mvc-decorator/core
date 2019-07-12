import {RequestMethod} from "../enums/request-method";
import {methodAndClassDecoratorFactoryBuilder} from "../utils/decorator-util";
import {getArrayValue} from "../utils/common-util";

export const REQUEST_MAPPING_METADATA_KEY = Symbol('REQUEST_MAPPING_METADATA_KEY');

export type RequestMappingParam = {
    method: RequestMethod[] | RequestMethod;
    path: string[] | string;
    params?: string[] | string;
    headers?: string[] | string;
    consumes?: string[] | string;
    produces?: string[] | string;
} | string | void;

export interface RequestMappingValue {
    path: string[];
    method: RequestMethod[];
    // ['a', '!b', 'c=4', 'b!=4']
    params: string[];
    headers: string[];
    // content-Type application/json、text/html
    consumes: string[];
    produces: string[];
}


const defaultMethod = [RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE];

const metadataValueConverter = (param) => {
    const value = {
        method: defaultMethod,
        path: [],
        params: [],
        headers: [],
        consumes: [],
        produces: []
    };
    if (param) {
        if (typeof param === 'string') {
            return {
                ...value,
                path: [param]
            };
        } else {
            return {
                ...value,
                method: getArrayValue(param.method, defaultMethod),//getArrayValue(param.method, ),
                path: getArrayValue(param.path),
                params: getArrayValue(param.params),
                headers: getArrayValue(param.headers),
                consumes: getArrayValue(param.consumes),
                produces: getArrayValue(param.produces)
            };
        }
    }
    return value;
};


export const RequestMapping = methodAndClassDecoratorFactoryBuilder<RequestMappingParam,
    RequestMappingValue, RequestMappingValue>(
    REQUEST_MAPPING_METADATA_KEY, metadataValueConverter, metadataValueConverter
);


export type MethodMappingParam = {
    path: string[] | string;
    params?: string[] | string;
    headers?: string[] | string;
    consumes?: string[] | string;
    produces?: string[] | string;
} | string | void;


/**
 * 为 GetMapping ... 所使用
 */
export const methodMappingFactory = (method: RequestMethod, param: MethodMappingParam): MethodDecorator => {
    if (param) {
        if (typeof param === 'string') {
            return RequestMapping({
                path: param,
                method: RequestMethod.GET
            });
        } else {
            return RequestMapping({
                ...param,
                method: RequestMethod.GET
            });
        }
    }
    return RequestMapping({
        path: '',
        method: RequestMethod.GET
    });
}
