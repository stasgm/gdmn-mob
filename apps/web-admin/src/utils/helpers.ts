import { INamedEntity } from '@lib/types';

import { IFileFilter, IFilterObject } from '../types';

import { fileFilterInitialValues, fileFilterValues } from './constants';

export const isNamedEntity = (obj: any): obj is INamedEntity => {
  return typeof obj === 'object' && 'name' in obj;
};

export const isDate = (date: any) => {
  return !isNaN(new Date(date).getDate());
};

export const getNumber = (value: any, defaultValue: number) =>
  value !== undefined && !isNaN(Number(value)) ? Number(value) : defaultValue;

export const getCode = () => {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
};

export const getFilterObject = (filesFilters: IFileFilter) => {
  const newFilters: IFilterObject = Object.entries(filesFilters).reduce(
    (prev, [name, value]) => {
      prev[name] = { ...prev[name], value };
      // prev[name] = name.indexOf('Id') === -1 ? { ...prev[name], value } : value;
      return prev;
    },
    { ...fileFilterValues },
  );
  return newFilters;
};

export const getFilesFilters = (filesFilters: IFilterObject) => {
  const newFilters: IFileFilter = Object.entries(filesFilters).reduce((prev, [name, value]) => {
    prev[name] = value.value;
    return prev;
  }, fileFilterInitialValues);
  return newFilters;
};
