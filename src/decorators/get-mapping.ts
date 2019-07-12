import {MethodMappingParam} from "./common/method-mapping";
import {methodMappingFactory} from "./request-mapping";
import {RequestMethod} from "../enums/request-method";

export const GetMapping = (param: MethodMappingParam) => methodMappingFactory(RequestMethod.GET, param);
