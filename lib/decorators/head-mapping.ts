import {RequestMethod} from '../http/request-method';
import {methodMappingFactory} from './request-mapping';

const HeadMapping = methodMappingFactory(RequestMethod.HEAD);

export {HeadMapping};
