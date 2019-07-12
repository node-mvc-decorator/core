import {RequestMethod} from "../enums/request-method";
import {methodMappingFactory, MethodMappingParam} from "./request-mapping";

export const TraceMapping = (param: MethodMappingParam) => methodMappingFactory(RequestMethod.TRACE, param);