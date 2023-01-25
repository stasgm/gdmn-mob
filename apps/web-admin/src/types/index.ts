import { IEntity, INamedEntity } from '@lib/types';

export interface IToolBarButton {
  name: string;
  onClick: () => void;
  sx?: any;
  color?: any;
  variant?: any;
  icon?: JSX.Element;
  disabled?: boolean;
}

// export interface IPageParams<T = IPageParam> {
//   [name: string]: T;
// }

export interface IPageParam {
  [name: string]: unknown;
}

export interface IHeadCells<T> {
  id: keyof T;
  label: string;
  sortEnable?: boolean;
  filterEnable?: boolean;
}

export interface IMessageHead {
  id: string;
  createdDate: Date;
  company: INamedEntity;
  appSystem: INamedEntity;
  producer: INamedEntity;
  consumer: INamedEntity;
  device: INamedEntity;
  message: string;
}

export interface IFileFormik {
  [fieldName: string]: string;
  path: string;
  fileName: string;
  company: string;
  appSystem: string;
  producer: string;
  consumer: string;
  device: string;
  uid: string;
  date: string;
}

export interface IDeviceLogFileFormik {
  [fieldName: string]: string;
  company: string;
  appSystem: string;
  contact: string;
  device: string;
  uid: string;
  date: string;
}

export interface ILinkedEntity extends IEntity {
  value: string | number | INamedEntity | INamedEntity[] | undefined;
  link?: string;
}
