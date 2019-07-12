import "reflect-metadata";

/**
 * 方法装饰器工厂 构造器 传入metadataKey metadataValueConverter 由param转化metadataValue
 * @param {symbol} metadataKey
 * @param {(options: P, target: Object, propertyKey: (string | symbol), descriptor) => V} metadataValueConverter
 * @return {(options: P) => MethodDecorator}
 */
export const methodDecoratorFactoryBuilder = <P = any, V = any>
(metadataKey: symbol, metadataValueConverter: (options: P, target: Function, propertyKey: string | symbol, descriptor) => V) =>
    (options: P): MethodDecorator => (target: Function, propertyKey: string | symbol, descriptor) =>
        Reflect.defineMetadata(metadataKey, metadataValueConverter(
            options, target, propertyKey, descriptor), target, propertyKey);
/**
 *
 * @param {symbol} metadataKey
 * @param {(param: P, target: Function, propertyKey: (string | symbol), descriptor) => V} metadataValueConverter
 * @return {MethodDecorator & ((options?: P) => MethodDecorator)}
 */
export const methodDecoratorFactoryBuilderOptionsEmptiable = <P = any, V = any>
(metadataKey: symbol, metadataValueConverter: (param: P, target: Object, propertyKey: string | symbol, descriptor) => V):
    MethodDecorator & ((options?: P) => MethodDecorator) => <any> ((...args) => {
    if ((args[0] && args[0] instanceof Function)) {
        return methodDecoratorFactoryBuilder(metadataKey, metadataValueConverter)(null)(args[0], args[1], args[2]);
    }
    return methodDecoratorFactoryBuilder(metadataKey, metadataValueConverter)(args[0]);
});

/**
 *
 * @param {symbol} metadataKey
 * @param {(param: P, target: Function, propertyKey: (string | symbol)) => V} metadataValueConverter
 * @return {(param: P) => PropertyDecorator}
 */
export const propertyDecoratorFactoryBuilder = <P = any, V = any>
(metadataKey: symbol, metadataValueConverter: (param: P, target: Object, propertyKey: string) => V) =>
    (option: P): PropertyDecorator => {
        return (target: Function, propertyKey: string) => {
            const metadataValue: V[] = Reflect.getOwnMetadata(metadataKey, target, propertyKey) || [];
            metadataValue.push(metadataValueConverter(option, target, propertyKey));
            Reflect.defineMetadata(metadataKey, metadataValue, target);
        };
            // Reflect.defineMetadata(metadataKey, metadataValueConverter(param, target, propertyKey), target, propertyKey);
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
 * 类装饰器工厂构造器    工厂参数可为空   工厂也可直接装饰类变成 装饰器构造器
 * 如：
 * 正常使用：@Controller({name: 'name'}) class A{}
 * 装饰器工厂参数为空：@Controller() class A{}
 * 直接装饰：@Controller class A{}
 *
 * @param {symbol} metadataKey
 * @param {(param: P, target: Function) => V} metadataValueConverter
 * @return {ClassDecorator & ((option: P) => ClassDecorator)}
 */
export const classDecoratorFactoryBuilderOptionsEmptiable = <P = any, V = any>
(metadataKey: symbol, metadataValueConverter: (param: P, target: Function) => V): ClassDecorator & ((option?: P) => ClassDecorator) =>
    (...args) => {
        // 本身为 Decorator  arg为target
        if (args[0] && args[0] instanceof Function) {
            return classDecoratorFactoryBuilder(metadataKey, metadataValueConverter)(null)(args[0]);
        }
        // 返回Decorator
        return classDecoratorFactoryBuilder(metadataKey, metadataValueConverter)(args[0]);
    };


/**
 * 参数装饰器工厂构造器
 * @param {symbol} metadataKey
 * @param {(option: P, target: Object, propertyKey: (string | symbol), parameterIndex: number) => V} metadataValueConverter
 * @return {(option: P) => ParameterDecorator}
 */
export const parameterDecoratorFactoryBuilder = <P = any, V = any>
(metadataKey: symbol, metadataValueConverter: (option: P, target: Object, propertyKey: string | symbol, parameterIndex: number) => V) =>
    (option: P): ParameterDecorator => (target: Function, propertyKey: string | symbol, parameterIndex: number) => {
        const metadataValue: V[] = Reflect.getOwnMetadata(metadataKey, target, propertyKey) || [];
        metadataValue.push(metadataValueConverter(option, target, propertyKey, parameterIndex));
        Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
    };

export const parameterDecoratorFactoryBuilderOptionsEmptiable = <P = any, V = any>
(metadataKey: symbol, metadataValueConverter: (option: P, target: Object, propertyKey: string | symbol, parameterIndex: number) => V):
    (ParameterDecorator & ((option?: P) => ParameterDecorator)) => <any> ((...args) => {
    if (args[0] && args[0] instanceof Function) {
        return parameterDecoratorFactoryBuilder(metadataKey, metadataValueConverter)(null)(args[0], args[1], args[2])
    }
    return parameterDecoratorFactoryBuilder(metadataKey, metadataValueConverter)(args[0]);
});

/**
 * 返回方法 类 装饰器工厂构造器
 * @param {symbol} metadataKey
 * @param {(param: P, target: Object, propertyKey: (string | symbol), descriptor) => V1} metadataValueMethodConverter
 * @param {(param: P, target: Function) => V2} metadataValueClassConverter
 * @return {(param: P) => (MethodDecorator & ClassDecorator)}
 */
export const methodAndClassDecoratorFactoryBuilder = <P = any, V1 = any, V2 = any>
(metadataKey: symbol, metadataValueMethodConverter: (param: P, target: Object, propertyKey: string | symbol, descriptor) => V1,
 metadataValueClassConverter: (param: P, target: Function) => V2) =>
    (param: P): MethodDecorator & ClassDecorator => (...args) => {
        if (args.length === 1) {
            return classDecoratorFactoryBuilder<P, V2>(metadataKey, metadataValueClassConverter)(param)(args[0]);
        } else if (args.length === 3) {
            return methodDecoratorFactoryBuilder<P, V1>(metadataKey, metadataValueMethodConverter)(param)(args[0], args[1], args[2]);
        }
    };
/**
 * 返回 方法 类  [装饰器工厂构造器（工厂参数可为空）、装饰器构造器]
 * @param {symbol} metadataKey
 * @param {(param: P, target: Object, propertyKey: (string | symbol), descriptor) => V1} metadataValueMethodConverter
 * 方法装饰器的 参数和metadataValue转换器
 * @param {(param: P, target: Function) => V2} metadataValueClassConverter 类装饰器的 参数和metadataValue转换器
 * @return {((option?: P) => (MethodDecorator & ClassDecorator)) & MethodDecorator & ClassDecorator}
 */
export const methodAndClassDecoratorFactoryBuilderOptionsEmptiable = <P = any, V1 = any, V2 = any>
(metadataKey: symbol, metadataValueMethodConverter: (param: P, target: Object, propertyKey: string | symbol, descriptor) => V1,
 metadataValueClassConverter: (param: P, target: Function) => V2):
    (((option?: P) => MethodDecorator & ClassDecorator) & MethodDecorator & ClassDecorator) =>
    (...args) => {
        if (args[0] && args[0] instanceof Function || args.length === 3) {
            if (args.length === 1) {
                return classDecoratorFactoryBuilder<P, V2>(metadataKey, metadataValueClassConverter)(null)(args[0]);
            } else if (args.length === 3) {
                return methodDecoratorFactoryBuilder<P, V1>(metadataKey, metadataValueMethodConverter)(null)(args[0], args[1], args[2]);
            }
        }
        return methodAndClassDecoratorFactoryBuilder(metadataKey, metadataValueMethodConverter, metadataValueClassConverter)(args[0])
    };
