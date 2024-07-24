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
  company: IFilterOption;
  appSystem: IFilterOption;
  folder: IFilterOption;
  fileName: IFilterOption;
  producer: IFilterOption;
  consumer: IFilterOption;
  uid: IFilterOption;
  // date: IFilterOption;
  dateFrom: IFilterOption;
  dateTo: IFilterOption;
}

export interface IFileFilter {
  [fieldName: string]: string;
  path: string;
  // id: string;
  folder: string;
  fileName: string;
  company: string;
  companyId: string;
  appSystem: string;
  producer: string;
  consumer: string;
  device: string;
  uid: string;
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
  producer: string;
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
