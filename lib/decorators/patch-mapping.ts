import {methodMappingFactory} from './request-mapping';
import {RequestMethod} from '../http/request-method';

const PatchMapping = methodMappingFactory(RequestMethod.PATCH);

export {PatchMapping};
