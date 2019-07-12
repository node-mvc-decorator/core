import {parameterDecoratorFactory} from "../utils/decorator-util";

export type RequestParamParam = {
    value?: string;
    name?: string;
    required?: boolean;
    defaultValue?: string;
} | string;

export type RequestParamValueItem = {
    name: string;
    required: boolean;
    defaultValue: string;
    parameterIndex: number;
}


export const REQUEST_PARAM_METADATA_KEY = Symbol('RequestParam');

export const RequestParam = parameterDecoratorFactory<RequestParamParam, RequestParamValueItem>(
    REQUEST_PARAM_METADATA_KEY, (param, target, propertyKey, parameterIndex) => {
        const value = {
            name: '',
            required: true,
            defaultValue: '',
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
                required: param.required || false,
                defaultValue: param.defaultValue || ''
            }
        }
    });