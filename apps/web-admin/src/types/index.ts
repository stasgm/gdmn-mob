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
  filterText?: string;
  fromRecord?: number;
  toRecord?: number;
  page?: number;
  limit?: number;
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

export interface IFilterObject {
  [fieldName: string]: IFilterOption;
  // path: string;
  folder: IFilterOption;
  fileName: IFilterOption;
  company: IFilterOption;
  appSystem: IFilterOption;
  producer: IFilterOption;
  consumer: IFilterOption;
  device: IFilterOption;
  uid: IFilterOption;
  date: IFilterOption;
  dateFrom: IFilterOption;
  dateTo: IFilterOption;
}

export interface IFileFilter {
  [fieldName: string]: string;
  folder: string;
  fileName: string;
  company: string;
  appSystem: string;
  producer: string;
  consumer: string;
  device: string;
  uid: string;
  date: string;
  dateFrom: string;
  dateTo: string;
}

export interface IFilterOption extends INamedEntity {
  type: 'text' | 'select' | 'date';
  value: string;
  visible: boolean;
}

export interface IFilePageParam extends IPageParam {
  filesFilters?: IFileFilter;
}

export interface IDeviceLogFileFilter {
  [fieldName: string]: string;
  company: string;
  appSystem: string;
  contact: string;
  device: string;
  uid: string;
  date: string;
}

export interface IDeviceLogPageParam extends IPageParam {
  logFilters?: IDeviceLogFileFilter;
}

export interface ILinkedEntity extends IEntity {
  value: string | number | INamedEntity | INamedEntity[] | undefined;
  link?: string;
}
