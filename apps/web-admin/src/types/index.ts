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
  fieldName?: string;
  value?: string;
  type?: 'number' | 'date';
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
  companyId: IFilterOption;
  appSystemId: IFilterOption;
  folder: IFilterOption;
  fileName: IFilterOption;
  producerId: IFilterOption;
  consumerId: IFilterOption;
  uid: IFilterOption;
  dateFrom: IFilterOption;
  dateTo: IFilterOption;
  searchQuery: IFilterOption;
}

export interface IFileFilter {
  [fieldName: string]: string;
  folder: string;
  fileName: string;
  companyId: string;
  appSystemId: string;
  producerId: string;
  consumerId: string;
  deviceId: string;
  uid: string;
  dateFrom: string;
  dateTo: string;
  searchQuery: string;
}

export interface IFilterOption extends INamedEntity {
  type: 'text' | 'select' | 'date';
  value: INamedEntity | string;
  visible: boolean;
  // data?: [];
  multi?: boolean;
}

export interface IFilterTable {
  [fieldName: string]: string;
  // appSystemId?: string;
  // companyId?: string;
}

export interface IFolderProps {
  appSystemId: string;
  companyId: string;
}
export interface IListOption {
  [fieldName: string]: INamedEntity[];
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
