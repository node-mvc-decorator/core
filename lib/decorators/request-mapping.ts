import {RequestMethod} from "../enums/request-method";
import {methodAndClassDecoratorFactoryBuilderOptionsEmptiable} from "../utils/decorator-util";
import {getArrayValue} from "../utils/common-util";

export const REQUEST_MAPPING_METADATA_KEY = Symbol('REQUEST_MAPPING_METADATA_KEY');

export type RequestMappingParam = {
    method: RequestMethod[] | RequestMethod;
    path: string[] | string;
    params?: string[] | string;
    headers?: string[] | string;
    consumes?: string[] | string;
    produces?: string[] | string;
} | string;

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

export const defaultValue = {
    method: defaultMethod,
    path: [''],
    params: [],
    headers: [],
    consumes: [],
    produces: []
};

const metadataValueConverter = (param) => {
    console.log(param);
    if (param) {
        if (typeof param === 'string') {
            return {
                ...defaultValue,
                path: [param]
            };
        } else {
            return {
                ...defaultValue,
                method: getArrayValue(param.method, defaultMethod),//getArrayValue(param.method, ),
                path: getArrayValue(param.path),
                params: getArrayValue(param.params),
                headers: getArrayValue(param.headers),
                consumes: getArrayValue(param.consumes),
                produces: getArrayValue(param.produces)
            };
        }
    }
    return {...defaultValue};
};


export const RequestMapping = methodAndClassDecoratorFactoryBuilderOptionsEmptiable<RequestMappingParam,
    RequestMappingValue, RequestMappingValue>(
    REQUEST_MAPPING_METADATA_KEY, metadataValueConverter, metadataValueConverter
);


export type MethodMappingParam = {
    path: string[] | string;
    params?: string[] | string;
    headers?: string[] | string;
    consumes?: string[] | string;
    produces?: string[] | string;
} | string;


/**
 * 为 GetMapping ... 所使用
 * @param method
 */
export const methodMappingFactory = (method: RequestMethod): MethodDecorator & ((option: MethodMappingParam) => MethodDecorator) =>
    (...args) => {
        // 没有option时
        if (args.length === 3) {
            return RequestMapping({
                path: '',
                method: method
            })(args[0], args[1], args[2]);
        } else if (args.length === 1) {
            if (typeof args[0] === 'string') {
                return RequestMapping({
                    path: args[0],
                    method: method
                });
            } else {
                return RequestMapping({
                    ...args[0],
                    method: method
                });
            }
        }
    };
