import {propertyDecoratorFactoryBuilder} from "../utils/decorator-util";
import {SingleParameterParam} from "./common/single-parameter";



const AUTOWIRED_METADA_KEY = Symbol('Autowired');

type AutowiredParam = {
    required?: boolean;
    type: any;
}

type AutowiredValueItem = {
    required: boolean;
    type: any;
    propertyKey: string;
}

const Autowired = propertyDecoratorFactoryBuilder<AutowiredParam, AutowiredValueItem>(
    AUTOWIRED_METADA_KEY, (option, target, propertyKey) => ({
        required: option.required,
        type: option.type,
        propertyKey
    })
);

export {AUTOWIRED_METADA_KEY, AutowiredParam, AutowiredValueItem, Autowired};
