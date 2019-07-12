import {methodMappingFactory, MethodMappingParam} from "./request-mapping";
import {RequestMethod} from "../enums/request-method";

export const DeleteMapping = (param: MethodMappingParam) => methodMappingFactory(RequestMethod.DELETE, param);