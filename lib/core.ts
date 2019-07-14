import {Constructor} from "./beans/constructor";
import {assertFalse, assertTrue, isConstructor, isFunction, stringValueToObjValue} from "./utils/common-util";
import {BadRequestError} from "./errors/bad-request-error";
import {defaultValue, REQUEST_MAPPING_METADATA_KEY, RequestMappingValue} from './decorators/request-mapping';
import * as path from 'path'
import {SERVICE_METADATA_KEY, ServiceValue} from "./decorators/service";
import {PATH_VARIABLE_METADATA_KEY, PathVariableValueItem} from "./decorators/path-variable";
import {REQUEST_PARAM_METADATA_KEY, RequestParamValueItem} from "./decorators/request-param";
import {REQUEST_BODY_METADATA_KEY, RequestBodyValueItem} from "./decorators/request-body";
import {Router} from "./beans/router";
import {CONTROLLER_METADATA_KEY} from "./decorators/controller";
import {AUTOWIRED_METADA_KEY, AutowiredValueItem} from "./decorators";
import {RequestMethod} from './enums/request-method';
import {HttpRequest} from './beans/http-request';
import {HttpResponse} from './beans/http-response';

// 类型和名字 对象实例储存
const typeMap = new Map<Constructor<any>, any>();
const nameMap = new Map<string, any>();

/**
 * 创建实例工场
 */
export const BeanFactory = <T>(constructor: Constructor<T>): T => {
    // 从类型中获得
    if (typeMap.has(constructor)) {
        return typeMap.get(constructor);
    }
    // 获取所有注入的服务
    let metadataValue: ServiceValue;

    metadataValue = Reflect.getMetadata(CONTROLLER_METADATA_KEY, constructor);
    if (!metadataValue) {
        metadataValue = Reflect.getMetadata(SERVICE_METADATA_KEY, constructor);
    }

    assertTrue(!!metadataValue, 'bean不能被注入');
    // 从名字中获得
    if (nameMap.has(metadataValue.name)) {
        return nameMap.get(metadataValue.name);
    }
    // 得到构造参数 来手动构造实例
    const args = (metadataValue.providers && metadataValue.providers.length) ?
        metadataValue.providers.map(provider => BeanFactory(provider)) : [];
    const result = new constructor(...args);
    const autowiredValue: AutowiredValueItem[] = Reflect.getMetadata(AUTOWIRED_METADA_KEY, constructor.prototype);
    if (autowiredValue) {
        autowiredValue.forEach(item => result[item.propertyKey] = BeanFactory(item.type));
    }
    // 放入 类型/名字
    typeMap.set(constructor, result);
    nameMap.set(metadataValue.name, result);
    return result;
};

/**
 * 解析路由
 * @param {Constructor<T>} constructor
 * @return {any}
 */
function mapRoute<T>(constructor: Constructor<T>): Router[] {
    // const prototype = Reflect.getPrototypeOf(instance);
    const prototype = constructor.prototype;

    let rootRequestMappingValue: RequestMappingValue = Reflect.getMetadata(REQUEST_MAPPING_METADATA_KEY, constructor) || defaultValue;

    const conditionsMap = new Map<string, Map<RequestMethod, object>>();

    return Reflect.ownKeys(prototype)
        .filter(key => !isConstructor(key) && isFunction(prototype[key]) && typeof key === 'string')
        .map(key => {
            const requestMappingValue: RequestMappingValue =
                Reflect.getMetadata(REQUEST_MAPPING_METADATA_KEY, constructor.prototype, <string> key);
            if (!requestMappingValue) {
                return [];
            }



            const path = rootRequestMappingValue.path.map(root =>
                requestMappingValue.path.map(child => root + child))
                .reduce((v1, v2) => v1.concat(v2), []);
            const method = rootRequestMappingValue.method.filter(root => requestMappingValue.method.includes(root));


            const uniqPath = [...new Set([...path])];
            const uniqMethod = [...new Set([...method])];

            const consumes = [...new Set([...rootRequestMappingValue.consumes, ...requestMappingValue.consumes])];
            const headers = [...new Set([...rootRequestMappingValue.headers, ...requestMappingValue.headers])];
            const params = [...new Set([...rootRequestMappingValue.params, ...requestMappingValue.params])];
            const produces = [...new Set([...rootRequestMappingValue.produces, ...requestMappingValue.produces])];

            return uniqPath.map(path => uniqMethod.map(method => ({
                path,
                method,
                consumes,
                headers,
                params,
                produces,
                type: constructor,
                methodName: <string> key
            }))).reduce((v1, v2) => v1.concat(v2), []);
        }).reduce((v1, v2) => {

            return v1.concat(v2);
        }, [])
}

/**
 * 请求处理方法
 * @param router 请求的路由信息
 * @param req 请求
 * @param res 响应
 */
export function requestHandler(router: Router, req: HttpRequest, res: HttpResponse) {
    const target = BeanFactory(router.type);
    const args = resolveMethodArgs(router.methodName, req, res, target);
    const result = target[router.methodName](...args);
    if (result) {
        res.send(result);
    }
}

/**
 * 解析出方法的所有参数
 */
function resolveMethodArgs(methodName, req: HttpRequest, res: HttpResponse, target) {
    const pathVariableItems: PathVariableValueItem[] = Reflect.getMetadata(PATH_VARIABLE_METADATA_KEY, target, methodName) || [];
    const requestParamItems: RequestParamValueItem[] = Reflect.getMetadata(REQUEST_PARAM_METADATA_KEY, target, methodName) || [];
    const requestBodyItems: RequestBodyValueItem[] = Reflect.getMetadata(REQUEST_BODY_METADATA_KEY, target, methodName) || [];
    const paramTypes: Constructor[] = Reflect.getMetadata('design:paramtypes', target, methodName);
    return paramTypes.map((paramType, index) =>
        getMethodArgValue(paramType, index, res, req, {pathVariableItems, requestParamItems, requestBodyItems}));
}

/**
 * 得到方法单个参数的值
 * @param paramType
 * @param index
 * @param res
 * @param req
 * @param pathVariableItems
 * @param requestParamItems
 * @param requestBodyItems
 * @return {any}
 */
function getMethodArgValue(paramType, index, res: HttpResponse, req: HttpRequest, {pathVariableItems, requestParamItems, requestBodyItems}) {

    // 判断是否为请求和响应类型参数
    if (paramType.prototype instanceof HttpResponse) {
        return res;
    } else if (paramType.prototype instanceof HttpRequest) {
        return req;
    }


    // 得到指定pathVariable参数 的信息
    const pathVariableItem = pathVariableItems.find(({parameterIndex}) => parameterIndex === index);
    if (pathVariableItem) {
        return getPathVariableArgValue(req, pathVariableItem, paramType);
    }

    // 得到指定pathVariable参数 的信息
    const requestParamItem = requestParamItems.find(({parameterIndex}) => parameterIndex === index);
    if (requestParamItem) {
        return getRequestParamArgValue(req, requestParamItem, paramType);
    }

    // 得到指定pathVariable参数 的信息
    const requestBodyItem = requestBodyItems.find(({parameterIndex}) => parameterIndex === index);
    if (requestBodyItem) {
        return getRequestBodyArgValue(req, requestBodyItem, paramType);
    }
    return null;

}

/**
 * 得到RequestParam注解变量的值
 * @param req
 * @param {RequestParamMetadataValueItem} requestParamItem
 * @param paramType
 * @return {any}
 */
function getRequestParamArgValue(req: HttpRequest, requestParamItem: RequestParamValueItem, paramType) {
    const value = req.query[requestParamItem.name];
    assertFalse(requestParamItem.required && !value, `${requestParamItem.name}不能为空`, BadRequestError);
    if (!value) {
        return requestParamItem.defaultValue;
    }
    return stringValueToObjValue(value, paramType);
}

function getRequestBodyArgValue(req: HttpRequest, requestBodyItem: RequestBodyValueItem, paramType) {
    const body = req.body;
    assertFalse(requestBodyItem.required && !body, `body不能为空`, BadRequestError);
    return body;
}

/**
 * 得到PathVariable注解变量的值
 * @param req
 * @param {PathVariableMetadataValueItem} pathVariableItem
 * @param paramType
 * @return {any}
 */
function getPathVariableArgValue(req: HttpRequest, pathVariableItem: PathVariableValueItem, paramType) {
    const value = req.params[pathVariableItem.name];
    assertFalse(pathVariableItem.required && !value, `${pathVariableItem.name}不能为空`, BadRequestError);
    if (!value) {
        return null;
    }
    return stringValueToObjValue(value, paramType);
}


export function errorHandler(error, res: HttpResponse) {
    console.error(error);
    res.status(error.status).send(error.message);
}


export function resolveRoute(constructors: Constructor[]) {
    return constructors.map(mapRoute).reduce((a, b) => a.concat(b), []);
}

export function resolveRouter(constructors: Constructor[], setRouter: (path: string, method: RequestMethod, handleRequest: (req: HttpRequest, res: HttpResponse) => void) => void) {
    constructors.map(mapRoute).reduce((a, b) => a.concat(b), []).forEach(router => {
        setRouter(router.path, router.method, (req, res) => {
            try {
                requestHandler(router, req, res);
            } catch (e) {
                errorHandler(e, res);
            }
        });
    });
}
