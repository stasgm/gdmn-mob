import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { INamedEntity, IEntity, IDocument, MandateProps, IHead } from '@lib/types';
import { INavItem } from '@lib/mobile-navigation';

// export interface IFormParam {
//   [fieldName: string]: string | number | unknown | Date;
// }
// export interface IInventoryFormParam extends IFormParam {
//   number?: string;
//   documentDate?: string;
//   onDate?: string;
//   status?: StatusType;
//   department?: IDepartment;
//   comment?: string;
// }

//Подразделения-склады
export type IDepartment = INamedEntity;

export interface IDocHead extends IHead {
  department?: IDepartment; //Подразделение
  comment?: string; // Комvентарий
}

export interface IDocLine extends IEntity {
  good: INamedEntity;
  quantity: number;
  packagekey?: INamedEntity; // Вид упаковки
  price?: number;
  remains?: number;
  barcode?: string;
  EID?: string;
  docType?: string;
}

export type IInventoryDocument = MandateProps<IDocument<IDocHead, IDocLine>, 'head' | 'lines'>;

export type AppThunk<ReturnType = void, S = void, A extends AnyAction = AnyAction> = ThunkAction<
  ReturnType,
  S,
  unknown,
  A
>;

export interface INavDocument extends INavItem {
  head: any;
  lines: any;
}

// export type DocTypeMeta<T> = {
//   [P in keyof T]?: {
//     visible?: boolean;
//     description: string;
//     type: FieldType;
//     refName?: string;
//     sortOrder?: number;
//     clearInput?: boolean;
//     disabled?: boolean;
//     onChangeText?: string;
//     required?: boolean;
//   };
// };

// export type DocTypeMetadata<T, K> = {
//   head?: DocTypeMeta<T>;
//   lines?: DocTypeMeta<K>;
// };

// export interface IDynDocumentType<T = IHead, K extends IEntity = IEntity> extends INamedEntity {
//   description?: string;
//   metadata?: DocTypeMetadata<T, K>;
//   icon?: string;
// }

// export interface IDynDocument<T = IHead, K extends IEntity = IEntity> extends IEntity {
//   [fieldName: string]: string | undefined | IDynDocumentType | DocfMetadata<T, K> | K[];
//   number: string;
//   documentDate: string;
//   documentType: IDynDocumentType;
//   status: StatusType;
//   metadata?: DocfMetadata<T, K>;
//   errorMessage?: string;
//   head?: T;
//   lines?: K[];
// }

// type DocumentFields = {
//   [fieldName: string]: IDocumentField;
// };

// export type FieldType = 'string' | 'date' | 'number' | 'boolean' | 'option' | 'ref';

// export type DocTypeMeta<T> = {
//   [P in keyof T]?: {
//     visible?: boolean;
//     description: string;
//     type: FieldType;
//     refName?: string;
//     sortOrder?: number;
//     clearInput?: boolean;
//     disabled?: boolean;
//     onChangeText?: string;
//     requeried?: boolean;
//   };
// };

// export type DocTypeMetadata<T, K> = {
//   head?: DocTypeMeta<T>;
//   lines?: DocTypeMeta<K>;
// };

// export interface IDocumentType<T = IHead, K extends IEntity = IEntity> extends INamedEntity {
//   description: string;
//   icon?: string;
//   metadata?: DocTypeMetadata<T, K>;
// }
