import {RequestMethod} from "../enums/request-method";
import {methodMappingFactory, MethodMappingParam} from "./request-mapping";

export const HeadMapping = (param: MethodMappingParam) => methodMappingFactory(RequestMethod.HEAD, param);