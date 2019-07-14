import {RequestMethod} from '../http/request-method';
import {methodMappingFactory} from './request-mapping';

const PutMapping = methodMappingFactory(RequestMethod.PUT);

export {PutMapping};
