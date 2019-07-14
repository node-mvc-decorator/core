import {methodMappingFactory} from './request-mapping';
import {RequestMethod} from '../http/request-method';

const OptionsMapping = methodMappingFactory(RequestMethod.OPTIONS);
export {OptionsMapping};
