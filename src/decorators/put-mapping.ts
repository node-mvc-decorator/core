import {RequestMethod} from "../enums/request-method";
import {methodMappingFactory, MethodMappingParam} from "./request-mapping";

export const PutMapping = (param: MethodMappingParam) => methodMappingFactory(RequestMethod.PUT, param);