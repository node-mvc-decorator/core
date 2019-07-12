import {getBeanName} from "../../utils/common-util";

export type SingleParameterParam<K extends string, T> =  {
    [P in K]: T;
} | T | void;

export type SingleParameterMetadataValue<K extends string, T> = {
    [P in K]: T;
}
