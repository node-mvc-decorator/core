import "reflect-metadata";
import {RequestMethod} from "../enums/request-method";

/**
 * 创建mapping装饰器
 * @param {RequestMethod} method
 * @return {(param?: (string | {value?: string; path?: string; params?: string[]; headers?: string[]; consumes?: string[]; produces?: string[]})) => MethodDecorator}
 */
// export const createMappingDecorator = (method: RequestMethod) => (param?: string | {
//     value?: string;
//     path?: string;
//     params?: string[];
//     headers?: string[];
//     consumes?: string[];
//     produces?: string[];
// }): MethodDecorator & ClassDecorator => {
//     return (...args) => {
//
//         let path = '';
//         if (typeof(param) == 'string') {
//             path = param;
//         } else {
//             path = param ? (param.value || param.path || '') : '';
//         }
//         if (args.length === 1) {
//             const target = args[0];
//             Reflect.defineMetadata(REQUEST_MAPPING_METADATA, param, target);
//         } else if (args.length === 3) {
//             const descriptor = args[2];
//             Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
//             Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);
//             Reflect.defineMetadata(REQUEST_MAPPING_METADATA, param, descriptor.value);
//         }
//
//     };
// };


/**
 * 方法装饰器工厂 构造器 传入metadataKey metadataValueConverter 由param转化metadataValue
 * @param {symbol} metadataKey
 * @param {(param: P, target: Object, propertyKey: (string | symbol), descriptor) => V} metadataValueConverter
 * @return {(param: P) => MethodDecorator}
 */
export const methodDecoratorFactoryBuilder = <P = any, V = any>
(metadataKey: symbol, metadataValueConverter: (param: P, target: Function, propertyKey: string | symbol, descriptor) => V) =>
    (param: P): MethodDecorator => (target: Function, propertyKey: string | symbol, descriptor) =>
    {
        console.log(metadataKey);
        console.log(target);
        console.log(propertyKey);
        Reflect.defineMetadata(metadataKey, metadataValueConverter(
            param, target, propertyKey, descriptor), target, propertyKey);
    };

export const propertyDecoratorFactoryBuilder = <P = any, V = any>
(metadataKey: symbol, metadataValueConverter: (param: P, target: Function, propertyKey: string | symbol) => V) =>
    (param: P): PropertyDecorator => {
        return (target: Function, propertyKey: string | symbol) =>
            Reflect.defineMetadata(metadataKey, metadataValueConverter(param, target, propertyKey), target, propertyKey);
    };


/**
 * 类装饰器工厂构造器
 * @param {symbol} metadataKey
 * @param {(param: P, target: Object) => V} metadataValueConverter
 * @return {(param: P) => ClassDecorator}
 */
export const classDecoratorFactoryBuilder = <P = any, V = any>
(metadataKey: symbol, metadataValueConverter: (param: P, target: Function) => V) =>
    (param: P): ClassDecorator => (target) => Reflect.defineMetadata(
        metadataKey, metadataValueConverter(param, target), target);



/**
 * 参数装饰器工厂构造器
 * @param {symbol} metadataKey
 * @param {(param: P, target: Object, propertyKey: (string | symbol), parameterIndex: number) => V} metadataValueConverter
 * @return {(param: P) => ParameterDecorator}
 */
export const parameterDecoratorFactory = <P = any, V = any>
(metadataKey: symbol, metadataValueConverter: (param: P, target: Function, propertyKey: string | symbol, parameterIndex: number) => V) =>
    (param: P): ParameterDecorator => (target: Function, propertyKey: string | symbol, parameterIndex: number) => {
        const metadataValue: V[] = Reflect.getOwnMetadata(metadataKey, target, propertyKey) || [];
        metadataValue.push(metadataValueConverter(param, target, propertyKey, parameterIndex));
        Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
    };

/**
 * 返回方法 类 装饰器工厂构造器
 * @param {symbol} metadataKey
 * @param {(param: P, target: Object, propertyKey: (string | symbol), descriptor) => V1} metadataValueMethodConverter
 * @param {(param: P, target: Object) => V2} metadataValueClassConverter
 * @return {(param: P) => (MethodDecorator & ClassDecorator)}
 */
export const methodAndClassDecoratorFactoryBuilder = <P = any, V1 = any, V2 = any>
(metadataKey: symbol, metadataValueMethodConverter: (param: P, target: Function, propertyKey: string | symbol, descriptor) => V1,
 metadataValueClassConverter: (param: P, target: Function) => V2) =>
    (param: P): MethodDecorator & ClassDecorator => (...args) => {
        if (args.length === 1) {
            return classDecoratorFactoryBuilder<P, V2>(metadataKey, metadataValueClassConverter)(param)(args[0]);
        } else if (args.length === 3) {
            return methodDecoratorFactoryBuilder<P, V1>(metadataKey, metadataValueMethodConverter)(param)(args[0], args[1], args[2]);
        }
    };



/**
 * 对一个metadataValue的item进行保存 （metadataValue本身为一个数组）
 * @param metadataKey key值
 * @param target metadata作用对象
 * @param propertyKey 对象属性key
 * @param {() => K} callback 保存的值
 */
export const saveMetadataValueItem = <T> (metadataKey: any, target, propertyKey, callback: () => T)  =>  {
    const metadataValue: T[] = Reflect.getOwnMetadata(metadataKey, target, propertyKey) || [];
    metadataValue.push(callback());
    Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
};