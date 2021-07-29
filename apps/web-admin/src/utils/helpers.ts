import { INamedEntity } from '@lib/types';

export const isNamedEntity = (obj: any): obj is INamedEntity => {
  return typeof obj === 'object' && 'name' in obj;
};

export const isDate = (date: any) => {
  return !isNaN(new Date(date).getDate());
};
