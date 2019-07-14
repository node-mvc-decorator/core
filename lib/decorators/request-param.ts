import {parameterDecoratorFactoryBuilder} from "../utils/decorator-util";

type RequestParamParam = {
    name: string;
    required?: boolean;
    defaultValue?: string;
} | string;

type RequestParamValueItem = {
    name: string;
    required: boolean;
    defaultValue: string;
    parameterIndex: number;
}


const REQUEST_PARAM_METADATA_KEY = Symbol('RequestParam');

const RequestParam = parameterDecoratorFactoryBuilder<RequestParamParam, RequestParamValueItem>(
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


export {REQUEST_PARAM_METADATA_KEY, RequestParamParam, RequestParamValueItem, RequestParam}
