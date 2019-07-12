import {propertyDecoratorFactoryBuilder} from "../utils/decorator-util";
import {SingleParameterParam} from "./common/single-parameter";



export const AUTOWIRED_METADA_KEY = Symbol('Autowired');

export type AutowiredParam = {
    required?: boolean;
    type: any;
}

export type AutowiredValue = {
    required: boolean;
    type: any;
}

export const Autowired = propertyDecoratorFactoryBuilder<AutowiredParam, AutowiredValue>(
    AUTOWIRED_METADA_KEY, param => ({
        required: param.required,
        type: param.type
    })
);