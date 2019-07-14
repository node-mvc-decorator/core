import {methodMappingFactory} from './request-mapping';
import {RequestMethod} from '../http/request-method';

export const OptionsMapping = methodMappingFactory(RequestMethod.OPTIONS);
