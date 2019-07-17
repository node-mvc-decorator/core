import {Constructor} from "./beans/constructor";
import {assertFalse, assertTrue, isConstructor, isFunction, stringValueToObjValue} from "./utils/common-util";
import {BadRequestError} from './http';
import {defaultValue, REQUEST_MAPPING_METADATA_KEY, RequestMappingValue} from './decorators';
import {SERVICE_METADATA_KEY, ServiceValue} from './decorators';
import {PATH_VARIABLE_METADATA_KEY, PathVariableValueItem} from "./decorators/path-variable";
import {REQUEST_PARAM_METADATA_KEY, RequestParamValueItem} from './decorators';
import {REQUEST_BODY_METADATA_KEY, RequestBodyValueItem} from './decorators';
import {Condition, Router} from './beans/router';
import {CONTROLLER_METADATA_KEY} from './decorators';
import {AUTOWIRED_METADA_KEY, AutowiredValueItem} from "./decorators";
import {RequestMethod} from './http';
import {CoreRequest} from './http';
import {CoreResponse} from './http';
import {InternalServiceError} from './http';
import {UnsupportedMediaTypeError} from './http';
import {NotAcceptableError} from './http';
import 'reflect-metadata';

// 类型和名字 对象实例储存
const typeMap = new Map<Constructor<any>, any>();
const nameMap = new Map<string, any>();

/**
 * 创建实例工场
 */
const BeanFactory = <T>(constructor: Constructor<T>): T => {
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

    assertTrue(!!metadataValue, InternalServiceError, 'bean不能被注入');
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

function getPath(rootPath: string, childPath: string) {
    const path = getStandardPath(rootPath) + getStandardPath(childPath);
    return path ? path : '/';
}

function getStandardPath(path: string) {
    while (path.endsWith('/')) {
        path = path.slice(0, -2);
    }
    if (path && !path.startsWith('/')) {
        path = `/${path}`;
    }
    return path;
}

/**
 * 解析路由
 * @param {Constructor<T>} constructor
 * @return {any}
 */
function mapRoute<T>(constructor: Constructor<T>): Router[] {
    // const prototype = Reflect.getPrototypeOf(instance);
    const prototype = constructor.prototype;

    let rootRequestMappingValue: RequestMappingValue = Reflect.getMetadata(REQUEST_MAPPING_METADATA_KEY, constructor) || defaultValue;

    const pathMap = Reflect.ownKeys(prototype)
        .filter(key => !isConstructor(key) && isFunction(prototype[key]) && typeof key === 'string')
        .map(key => {
            const requestMappingValue: RequestMappingValue =
                Reflect.getMetadata(REQUEST_MAPPING_METADATA_KEY, constructor.prototype, <string> key);
            if (!requestMappingValue) {
                return [];
            }
            const path = rootRequestMappingValue.path.map(root =>
                requestMappingValue.path.map(child => getPath(root, child)))
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
                methodName: <string> key
            }))).reduce((v1, v2) => v1.concat(v2), []);
        }).reduce((v1, v2) => v1.concat(v2)).reduce((pathMap, item) => {
            const condition = {
                consumes:item.consumes,
                headers: item.headers,
                params: item.params,
                produces: item.produces,
                type: constructor,
                methodName: item.methodName
            };
            let methodMap;
            if (pathMap.has(item.path)) {
                methodMap = pathMap.get(item.path);
                if (methodMap.has(item.method)) {
                    const conditions = methodMap.get(item.method);
                    conditions.push(condition);
                    return pathMap;
                }
            } else {
                methodMap = new Map<RequestMethod, Condition[]>();
                pathMap.set(item.path, methodMap)
            }
            methodMap.set(item.method, [condition]);
            return pathMap;
        }, new Map<string, Map<RequestMethod, Condition[]>>());
    return [...pathMap].reduce((v1, v2) => {
        [...v2[1]].forEach(item => {
            v1.push({
                path: v2[0],
                method: item[0],
                conditions: item[1]
            });
        });
        return v1;
    }, []);
}

/**
 * 请求处理方法
 * @param conditions
 * @param req 请求
 * @param res 响应
 */
function requestHandler(conditions: Condition[], req: CoreRequest, res: CoreResponse) {
    conditions = conditions.filter(condition => complexVerificationCondition(req.query, condition.params));
    assertTrue(!!conditions.length, BadRequestError, `参数不满足：${conditions.map(({params}) => params)}`);

    conditions = conditions.filter(condition => complexVerificationCondition(req.headers, condition.headers));
    assertTrue(!!conditions.length, BadRequestError, `header不满足：${conditions.map(({headers}) => headers)}`);
    assertTrue(!!conditions.length, BadRequestError);

    conditions = conditions.filter(condition => verificationContentType(req.headers['content-type'], condition.consumes));

    assertTrue(!!conditions.length, UnsupportedMediaTypeError, `content-type不满足：${conditions.map(({consumes}) => consumes)}`);
    conditions = conditions.filter(condition => verificationContentType(req.headers['accept'], condition.produces));
    assertTrue(!!conditions.length, NotAcceptableError, `accept不满足：${conditions.map(({produces}) => produces)}`);


    assertTrue(conditions.length === 1, InternalServiceError, `多个路径匹配`);

    const type = req.headers['accept'] || conditions[0].produces[0];
    if (type) {
        res.type(type);
    }
    const target = BeanFactory(conditions[0].type);
    const args = resolveMethodArgs(conditions[0].methodName, req, res, target);
    const result = target[conditions[0].methodName](...args);
    if (result) {
        res.send(result);
    }
    res.end();
}

/**
 * 简单校验 判断data是否在conditionValues中
 * @param data
 * @param conditionValues
 */
function verificationContentType(data: any, conditionValues: string[]) {
    return !data || !conditionValues.length || conditionValues.some(value => value.includes(data));
}

/**
 * 复杂校验 三种情况 ['a', 'b=3', 'c!=4']
 * @param data
 * @param conditionValues
 */
function complexVerificationCondition(data: any, conditionValues: string[]) {
    return !conditionValues.length || conditionValues.every(conditionValue => {
        if (!data) {
            return false;
        }
        if (conditionValue.includes('=')) {
            const [key, value] = conditionValue.split('=', 2);
            if (key.endsWith('!')) {
                return data[key.slice(0, -2)] != value;
            }
            return data[key] == value;
        }
        return data[conditionValue] !== undefined;
    });
}


/**
 * 解析出方法的所有参数
 */
function resolveMethodArgs(methodName, req: CoreRequest, res: CoreResponse, target) {
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
function getMethodArgValue(paramType, index, res: CoreResponse, req: CoreRequest, {pathVariableItems, requestParamItems, requestBodyItems}) {

    // 判断是否为请求和响应类型参数
    if (paramType.prototype instanceof CoreResponse) {
        return res;
    } else if (paramType.prototype instanceof CoreRequest) {
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
function getRequestParamArgValue(req: CoreRequest, requestParamItem: RequestParamValueItem, paramType) {
    const value = req.query[requestParamItem.name];
    assertFalse(requestParamItem.required && !value, BadRequestError, `${requestParamItem.name}不能为空`);
    if (!value) {
        return requestParamItem.defaultValue;
    }
    return stringValueToObjValue(value, paramType);
}

function getRequestBodyArgValue(req: CoreRequest, requestBodyItem: RequestBodyValueItem, paramType) {
    const body = req.body;
    assertFalse(requestBodyItem.required && !body, BadRequestError, `body不能为空`);
    return body;
}

/**
 * 得到PathVariable注解变量的值
 * @param req
 * @param {PathVariableMetadataValueItem} pathVariableItem
 * @param paramType
 * @return {any}
 */
function getPathVariableArgValue(req: CoreRequest, pathVariableItem: PathVariableValueItem, paramType) {
    const value = req.params[pathVariableItem.name];
    assertFalse(pathVariableItem.required && !value, BadRequestError, `${pathVariableItem.name}不能为空`);
    if (!value) {
        return null;
    }
    return stringValueToObjValue(value, paramType);
}


function errorHandler(error, res: CoreResponse) {
    console.error(error);
    res.status(error.status).send(error.message).end();
}


function resolveRouter(constructors: Constructor[], setRouter: (path: string, method: string, handleRequest: (req: CoreRequest, res: CoreResponse) => void) => void) {
    constructors.map(mapRoute).reduce((a, b) => a.concat(b), []).forEach(router => {
        console.log(JSON.stringify(router));
        setRouter(router.path, router.method, (req, res) => {
            try {
                requestHandler(router.conditions, req, res);
            } catch (e) {
                errorHandler(e, res);
            }
        });
    });
}

export {resolveRouter};
