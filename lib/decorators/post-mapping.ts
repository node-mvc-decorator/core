import {RequestMethod} from '../http/request-method';
import {methodMappingFactory} from './request-mapping';

const PostMapping = methodMappingFactory(RequestMethod.POST);

export {PostMapping};
