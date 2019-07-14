import {classDecoratorFactoryBuilder, classDecoratorFactoryBuilderOptionsEmptiable} from "../utils/decorator-util";
import {SingleParameterMetadataValue, SingleParameterParam} from "./common/single-parameter";
import {getBeanName} from "../utils/common-util";
import {Constructor} from "../beans/constructor";

const SERVICE_METADATA_KEY = Symbol('Service');
const serviceMetadataValueConverter = (param, target) => {
    const providers: Constructor[] = Reflect.getMetadata('design:paramtypes', target);
    if (param) {
        if (typeof param === 'string') {
            return {
                name: param,
                providers
            };
        } else {
            return {
                name: param.name,
                providers
            };
        }
    }
    return {
        name: getBeanName(target),
        providers
    };
};

type ServiceValue = {
    name: string;
    providers: Constructor[];
}

const Service = classDecoratorFactoryBuilderOptionsEmptiable<
    SingleParameterParam<'name', string>, ServiceValue>(
    SERVICE_METADATA_KEY, serviceMetadataValueConverter);

export {SERVICE_METADATA_KEY, serviceMetadataValueConverter, ServiceValue, Service};
