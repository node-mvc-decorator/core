import {methodMappingFactory} from './request-mapping';
import {RequestMethod} from '../http/request-method';

export const PatchMapping = methodMappingFactory(RequestMethod.PATCH);
