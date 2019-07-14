import {methodMappingFactory} from './request-mapping';
import {RequestMethod} from '../enums/request-method';

export const PatchMapping = methodMappingFactory(RequestMethod.PATCH);
