import {propertyDecoratorFactoryBuilder} from "../utils/decorator-util";
import {SingleParameterParam} from "./common/single-parameter";



export const AUTOWIRED_METADA_KEY = Symbol('Autowired');

export type AutowiredParam = {
    required?: boolean;
    type: any;
}

export type AutowiredValueItem = {
    required: boolean;
    type: any;
    propertyKey: string;
}

export const Autowired = propertyDecoratorFactoryBuilder<AutowiredParam, AutowiredValueItem>(
    AUTOWIRED_METADA_KEY, (option, target, propertyKey) => ({
        required: option.required,
        type: option.type,
        propertyKey
    })
);