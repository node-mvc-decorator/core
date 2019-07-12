import {classDecoratorFactoryBuilder} from "../utils/decorator-util";
import {SingleParameterMetadataValue, SingleParameterParam} from "./common/single-parameter";
import {serviceMetadataValueConverter} from "./service";

export const CONTROLLER_METADATA_KEY = Symbol('CONTROLLER_METADATA_KEY');


export const Controller = classDecoratorFactoryBuilder<
    SingleParameterParam<'name', string>, SingleParameterMetadataValue<'name', string>>(
    CONTROLLER_METADATA_KEY, serviceMetadataValueConverter);


