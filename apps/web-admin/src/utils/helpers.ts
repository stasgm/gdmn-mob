import { INamedEntity } from '@lib/types';

export const isNamedEntity = (obj: any): obj is INamedEntity => {
  return typeof obj === 'object' && 'name' in obj;
};

export const isDate = (date: any) => {
  return !isNaN(new Date(date).getDate());
};

export const getNumber = (value: any, defaultValue: number) =>
  value !== undefined && !isNaN(Number(value)) ? Number(value) : defaultValue;
