import {methodMappingFactory} from './request-mapping';
import {RequestMethod} from '../http/request-method';

export const DeleteMapping = methodMappingFactory(RequestMethod.DELETE);
