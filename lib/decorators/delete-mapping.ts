import {methodMappingFactory} from './request-mapping';
import {RequestMethod} from '../enums/request-method';

export const DeleteMapping = methodMappingFactory(RequestMethod.DELETE);
