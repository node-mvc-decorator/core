import {RequestMethod} from '../enums/request-method';
import {methodMappingFactory} from './request-mapping';

export const PutMapping = methodMappingFactory(RequestMethod.PUT);
