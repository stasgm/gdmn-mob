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

export interface IPageParam {
  [name: string]: any;
  filterText?: string;
  fromRecord?: number;
  toRecord?: number;
  page?: number;
  limit?: number;
  tab?: number;
}

export interface IHeadCells<T> {
  id: keyof T;
  label: any;
  sortEnable?: boolean;
  filterEnable?: boolean;
  fieldName?: string;
  value?: string;
  type?: 'number' | 'date' | 'string' | 'object' | 'boolean';
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
  producerId: IFilterOption;
  uid: IFilterOption;
}

export interface IFileFilterObject extends IFilterObject {
  folder: IFilterOption;
  fileName: IFilterOption;
  consumerId: IFilterOption;
  // date: IFilterOption;
  dateFrom: IFilterOption;
  dateTo: IFilterOption;
}

export interface ILogFilterObject extends IFilterObject {
  producerId: IFilterOption;
  deviceId: IFilterOption;
  dateFrom: IFilterOption;
  dateTo: IFilterOption;
  mDateFrom: IFilterOption;
  mDateTo: IFilterOption;
}

export interface IFileFilter {
  [fieldName: string]: string;
  path: string;
  // id: string;
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
}

export interface ILogFileFilter {
  [fieldName: string]: string;
  companyId: string;
  appSystemId: string;
  producerId: string;
  deviceId: string;
  dateFrom: string;
  dateTo: string;
  mDateFrom: string;
  mDateTo: string;
}

export interface IFilterOption extends INamedEntity {
  type: 'text' | 'select' | 'date';
  value: INamedEntity | string;
  visible: boolean;
  data?: [];
  valueId?: string;
}

export interface IFilterTable {
  [fieldName: string]: string;
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

export interface ITabPanel {
  name: string;
  component: React.ReactNode;
}
