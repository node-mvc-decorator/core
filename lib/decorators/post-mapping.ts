import {RequestMethod} from "../enums/request-method";
import {methodMappingFactory, MethodMappingParam} from "./request-mapping";

export const PostMapping = (param: MethodMappingParam) => methodMappingFactory(RequestMethod.POST, param);