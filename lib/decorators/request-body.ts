import {parameterDecoratorFactoryBuilder, parameterDecoratorFactoryBuilderOptionsEmptiable} from "ts-decorators-utils";
import {SingleParameterParam} from "./common/single-parameter";


const REQUEST_BODY_METADATA_KEY = Symbol('RequestBody');

type RequestBodyValueItem = {
    required: boolean;
    parameterIndex: number;
}

const RequestBody = parameterDecoratorFactoryBuilderOptionsEmptiable<SingleParameterParam<'required', boolean>, RequestBodyValueItem>(
    REQUEST_BODY_METADATA_KEY, (param, target, propertyKey, parameterIndex) => {
        const value = {
            required: false,
            parameterIndex
        };
        if (param) {
            if (typeof param === 'boolean') {
                return {
                    ...value,
                    required: param
                }
            } else {
                return {
                    ...value,
                    required: param.required
                }
            }
        }
        return value;
    }
);

export {REQUEST_BODY_METADATA_KEY, RequestBodyValueItem, RequestBody};

