import {InternalServiceError} from "../errors/internal-service-error";
import {BadRequestError} from "../errors/bad-request-error";

export function isConstructor(key: string | number | symbol) {
    return key === 'constructor';
}

export function isFunction(value: any) {
    return value instanceof Function;
}


export function assertTrue(condition: boolean, message: string, type = InternalServiceError) {
    if (!condition) {
        throw new type(message);
    }
}

export function assertFalse(condition: boolean, message: string, type = InternalServiceError) {
    assertTrue(!condition, message, type);
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
            assertFalse(isNaN(numValue), 'String转Number类型转换异常', BadRequestError);
            return numValue;
        case String:
            return value;
        case Boolean:
            assertTrue(value === 'true' || value === 'false', 'String转Boolean类型转换异常', BadRequestError);
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