import {methodMappingFactory, MethodMappingParam} from "./request-mapping";
import {RequestMethod} from "../enums/request-method";

export const GetMapping = (param: MethodMappingParam) => methodMappingFactory(RequestMethod.GET, param);
