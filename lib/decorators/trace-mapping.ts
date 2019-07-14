import {RequestMethod} from '../enums/request-method';
import {methodMappingFactory} from './request-mapping';

export const TraceMapping = methodMappingFactory(RequestMethod.TRACE);
