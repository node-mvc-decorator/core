import {parameterDecoratorFactory} from "../utils/decorator-util";


export type PathVariableParam = {
    name: string;
    required?: boolean;
} | string;

export type PathVariableValueItem = {
    name: string;
    required: boolean;
    parameterIndex: number;
}

export const PATH_VARIABLE_METADATA_KEY = Symbol('PathVariable');
export const PathVariable = parameterDecoratorFactory<PathVariableParam, PathVariableValueItem>(
    PATH_VARIABLE_METADATA_KEY, (param, target, propertyKey, parameterIndex) => {
        const value = {
            name: '',
            required: true,
            parameterIndex
        };
        if (typeof param === 'string') {
            return {
                ...value,
                name: param
            }
        } else {
            return {
                ...value,
                name: param.name,
                required: param.required || false
            }
        }
    });