import { ICompany, IResponse, IUser } from '@lib/types';

import { error, company as types } from '../types';

import { api } from '../config';

const addCompany = async (title: string, externalId: string) => {
  const body = {
    title,
    externalId,
  };
  const res = await api.post<IResponse<string>>('/companies', body);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'ADD_COMPANY',
      companyId: resData.data,
    } as types.IAddCompanyResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as error.INetworkError;
};

const getCompanies = async () => {
  const res = await api.get<IResponse<ICompany[]>>('/companies');
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'GET_COMPANIES',
      companies: resData.data,
    } as types.IGetCompaniesResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as error.INetworkError;
};

const getCompany = async (companyId: string) => {
  const res = await api.get<IResponse<ICompany>>(`/companies/${companyId}`);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'GET_COMPANY',
      company: resData.data,
    } as types.IGetCompanyResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as error.INetworkError;
};

const updateCompany = async (company: Partial<ICompany>) => {
  const res = await api.patch<IResponse<string>>(`/companies/${company.id}`, company);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'UPDATE_COMPANY',
      companyId: resData.data,
    } as types.IUpdateCompanyResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as error.INetworkError;
};

const getUsersByCompany = async (companyId: string) => {
  const res = await api.get<IResponse<IUser[]>>(`/companies/${companyId}/users`);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'GET_USERS_BY_COMPANY',
      users: resData.data,
    } as types.IGetCompanyUsersResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as error.INetworkError;
};

const removeCompany = async (companyId: string) => {
  const res = await api.delete<IResponse<void>>(`/companies/${companyId}`);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'REMOVE_COMPANY',
    } as types.IRemoveCompanyResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as error.INetworkError;
};

export default {
  addCompany,
  getCompanies,
  getCompany,
  updateCompany,
  getUsersByCompany,
  removeCompany,
};
