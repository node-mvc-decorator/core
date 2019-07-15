import {classDecoratorFactoryBuilderOptionsEmptiable} from 'ts-decorators-utils';
import {SingleParameterMetadataValue, SingleParameterParam} from "./common/single-parameter";
import {serviceMetadataValueConverter} from "./service";

const CONTROLLER_METADATA_KEY = Symbol('CONTROLLER_METADATA_KEY');


const Controller = classDecoratorFactoryBuilderOptionsEmptiable<
    SingleParameterParam<'name', string>, SingleParameterMetadataValue<'name', string>>(
    CONTROLLER_METADATA_KEY, serviceMetadataValueConverter);



export {CONTROLLER_METADATA_KEY, Controller};
