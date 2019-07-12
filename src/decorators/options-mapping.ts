import {methodMappingFactory, MethodMappingParam} from "./request-mapping";
import {RequestMethod} from "../enums/request-method";

export const OptionsMapping = (param: MethodMappingParam) => methodMappingFactory(RequestMethod.OPTIONS, param);