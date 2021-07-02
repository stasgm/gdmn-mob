import { IEntity, INamedEntity } from './models';
export declare type StatusType = 'DRAFT' | 'READY' | 'SENT' | 'PROCESSED';
export interface IHead {
    [fieldname: string]: unknown;
}
interface IDocument<T = IHead, K extends IEntity[] = IEntity[]> extends IEntity {
    number: string;
    documentDate: string;
    documentType: INamedEntity;
    status: StatusType;
    head?: T;
    lines?: K;
}
export declare type MandateProps<T extends IEntity, K extends keyof T> = Omit<T, K> & {
    [MK in K]-?: NonNullable<T[MK]>;
};
export { IDocument };
