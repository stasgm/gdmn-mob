import { IEntity } from './models';
interface IReferenceData extends IEntity {
    [fieldName: string]: unknown;
}
declare type IRefMetadata<T> = {
    [P in keyof T]?: {
        visible?: true;
        name: string;
    } | {
        visible: false;
        name: never;
    };
};
interface IReference<T = IReferenceData> {
    id: string;
    name: string;
    description?: string;
    metadata?: IRefMetadata<T>;
    visible?: boolean;
    data: T[];
}
interface IReferences<T = any> {
    [name: string]: IReference<T>;
}
export { IReference, IReferences, IReferenceData, IRefMetadata };
