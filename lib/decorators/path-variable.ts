import {parameterDecoratorFactoryBuilder} from 'ts-decorators-utils';


type PathVariableParam = {
    name: string;
    required?: boolean;
} | string;

type PathVariableValueItem = {
    name: string;
    required: boolean;
    parameterIndex: number;
}

const PATH_VARIABLE_METADATA_KEY = Symbol('PathVariable');
const PathVariable = parameterDecoratorFactoryBuilder<PathVariableParam, PathVariableValueItem>(
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

export {PATH_VARIABLE_METADATA_KEY, PathVariableParam, PathVariableValueItem, PathVariable};
