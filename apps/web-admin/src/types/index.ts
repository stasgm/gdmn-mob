import { INamedEntity } from '@lib/types';

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
