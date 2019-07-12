import {parameterDecoratorFactory, saveMetadataValueItem} from "../utils/decorator-util";
import {REQUEST_BODY_METADATA} from "../constants/metadata-key";
import {RequestBodyMetadataValueItem} from "../beans/metadata-value/request-body-metadata-value-item";
import {SingleParameterMetadataValue, SingleParameterParam} from "./common/single-parameter";


export const REQUEST_BODY_METADATA_KEY = Symbol('RequestBody');

export type RequestBodyValueItem = {
    required: boolean;
    parameterIndex: number;
}

export const RequestBody = parameterDecoratorFactory<SingleParameterParam<'required', boolean>, RequestBodyValueItem>(
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

