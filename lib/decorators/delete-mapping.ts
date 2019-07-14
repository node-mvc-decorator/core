import {methodMappingFactory} from './request-mapping';
import {RequestMethod} from '../http/request-method';

const DeleteMapping = methodMappingFactory(RequestMethod.DELETE);

export {DeleteMapping};
