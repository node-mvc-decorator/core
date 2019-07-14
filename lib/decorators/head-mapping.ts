import {RequestMethod} from '../http/request-method';
import {methodMappingFactory} from './request-mapping';

export const HeadMapping = methodMappingFactory(RequestMethod.HEAD);
