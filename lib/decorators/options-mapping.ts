import {methodMappingFactory} from './request-mapping';
import {RequestMethod} from '../enums/request-method';

export const OptionsMapping = methodMappingFactory(RequestMethod.OPTIONS);
