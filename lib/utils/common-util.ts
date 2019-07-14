import {InternalServiceError} from "../http/errors/internal-service-error";
import {BadRequestError} from "../http/errors/bad-request-error";
import {HttpError} from '../http/errors/http-error';

export function isConstructor(key: string | number | symbol) {
    return key === 'constructor';
}

export function isFunction(value: any) {
    return value instanceof Function;
}


export function assertTrue(condition: boolean, type = InternalServiceError, message?: string) {
    if (!condition) {
        throw new type(message);
    }
}

export function assertFalse(condition: boolean, type = InternalServiceError, message?: string) {
    assertTrue(!condition, type, message);
}

export function getBeanName(fun: Function) {
    return fun.name.replace(/([A-Z]+)(.*)/, (m, m1, m2) => m1.toLowerCase() + m2);
}

/**
 * string变量值转换成指定变量值
 * @param {string} value
 * @param type
 * @return {any}
 */
export function stringValueToObjValue(value: string, type) {
    switch (type) {
        case Number:
            const numValue = Number(value);
            assertFalse(isNaN(numValue), BadRequestError, 'String转Number类型转换异常');
            return numValue;
        case String:
            return value;
        case Boolean:
            assertTrue(value === 'true' || value === 'false', BadRequestError, 'String转Boolean类型转换异常');
            return value === 'true';
        default:
            throw new BadRequestError('没有指定类型的数据');
    }
}

export function getArrayValue<T>(value: T | T[], defaultValue: T[] = []): T[] {
    if (value) {
        if (typeof value === 'string') {
            return [value];
        } else {
            return <T[]> value;
        }
    } else {
        return defaultValue;
    }
}
