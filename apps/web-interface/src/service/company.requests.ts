import { DEVICE_ID, get, patch, post } from './http.service';
import { IResponse, IUser, ICompany } from '../../../common';
import { ICompaniesResponse, INetworkError, IGetCompanyResponse, ICreateCompanyResponse, IUpdateCompanyResponse, IGetCompanyUsersResponse } from '../queryTypes';

const getAllCompanies = async () => {
  const res = await get<IResponse<ICompany[]>>(`/companies/?deviceId=${DEVICE_ID}`);

  if (res.result) {
    return {
      type: 'USER_COMPANIES',
      companies: res.data
    } as ICompaniesResponse;
  }
  return {
    type: 'ERROR',
    message: res.error
  } as INetworkError;
};

const getCompany = async (companyId: string) => {
  const res = await get<IResponse<ICompany>>(`/companies/${companyId}?deviceId=${DEVICE_ID}`);

  if (res.result) {
    return {
      type: 'USER_COMPANY',
      company: {companyId: res.data?.id, companyName: res.data?.title}
    } as IGetCompanyResponse;
  }
  return {
    type: 'ERROR',
    message: res.error
  } as INetworkError;
};

const createCompany = async (title: string) => {
  const body = JSON.stringify({
    title
  });
  const res = await post<IResponse<ICompany>>(`/companies/?deviceId=${DEVICE_ID}`, body);

  if (res.result) {
    return {
      type: 'NEW_COMPANY',
      companyId: res.data?.id
    } as ICreateCompanyResponse;
  }
  return {
    type: 'ERROR',
    message: res.error
  } as INetworkError;
};

const updateCompany = async (title: string, companyId: string) => {
  const body = JSON.stringify({
    title
  });
  const res = await patch<IResponse<ICompany>>(`/companies/${companyId}?deviceId=${DEVICE_ID}`, body);

  if (res.result) {
    return {
      type: 'UPDATE_COMPANY'
    } as IUpdateCompanyResponse;
  }
  return {
    type: 'ERROR',
    message: res.error
  } as INetworkError;
};

const getCompanyUsers = async (companyId: string) => {
  const res = await get<IResponse<IUser[]>>(`/companies/${companyId}/users?deviceId=${DEVICE_ID}`);

  if (res.result) {
    return {
      type: 'COMPANY_USERS',
      users: res.data
    } as IGetCompanyUsersResponse;
  }
  return {
    type: 'ERROR',
    message: res.error
  } as INetworkError;
};

export { createCompany, getCompany, getAllCompanies, updateCompany, getCompanyUsers };
