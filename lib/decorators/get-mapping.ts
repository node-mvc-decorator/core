import {methodMappingFactory} from './request-mapping';
import {RequestMethod} from '../http/request-method';

// MethodMappingParam
const GetMapping = methodMappingFactory(RequestMethod.GET);

export {GetMapping};

