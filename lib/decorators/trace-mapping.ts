import {RequestMethod} from '../http/request-method';
import {methodMappingFactory} from './request-mapping';

const TraceMapping = methodMappingFactory(RequestMethod.TRACE);

export {TraceMapping};
