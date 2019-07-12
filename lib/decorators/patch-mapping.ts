import {methodMappingFactory, MethodMappingParam} from "./request-mapping";
import {RequestMethod} from "../enums/request-method";

export const PatchMapping = (param: MethodMappingParam) => methodMappingFactory(RequestMethod.PATCH, param);