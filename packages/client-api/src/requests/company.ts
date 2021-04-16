import { NewCompany, IResponse, IUser, ICompany } from '@lib/types';

import { error, company as types } from '../types';

import { api } from '../config';

const addCompany = async (newCompany: NewCompany) => {
  const res = await api.post<IResponse<ICompany>>('/companies', newCompany);
  const dto = res.data;

  if (!dto.result || !dto.data) {
    return {
      type: 'ERROR',
      message: res.data.error,
    } as error.INetworkError;
  }
  // const newObject = await mapDtoToObject(dto.data);

  return {
    type: 'ADD_COMPANY',
    company: dto.data,
  } as types.IAddCompanyResponse;
};

const getCompanies = async () => {
  const res = await api.get<IResponse<ICompany[]>>('/companies');
  const dto = res.data;

  if (!dto.result || !dto.data) {
    return {
      type: 'ERROR',
      message: res.data.error,
    } as error.INetworkError;
  }

  // const promises = dto.data.map(async (i) => {
  //   return await mapDtoToObject(i);
  // });

  // const newObjects = await Promise.all(promises);

  return {
    type: 'GET_COMPANIES',
    companies: dto.data,
  } as types.IGetCompaniesResponse;
};

const getCompany = async (companyId: string) => {
  const res = await api.get<IResponse<ICompany>>(`/companies/${companyId}`);
  const dto = res.data;

  if (!dto.result || !dto.data) {
    return {
      type: 'ERROR',
      message: res.data.error,
    } as error.INetworkError;
  }
  // const newObject = await mapDtoToObject(dto.data);
  return {
    type: 'GET_COMPANY',
    company: dto.data,
  } as types.IGetCompanyResponse;
};

const updateCompany = async (object: Partial<ICompany>) => {
  const res = await api.patch<IResponse<ICompany>>(`/companies/${object.id}`, object);
  const dto = res.data;

  if (!dto.result || !dto.data) {
    return {
      type: 'ERROR',
      message: res.data.error,
    } as error.INetworkError;
  }
  // const newObject = await mapDtoToObject(dto.data);

  return {
    type: 'UPDATE_COMPANY',
    company: dto.data,
  } as types.IUpdateCompanyResponse;
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

  if (!resData.result) {
    return {
      type: 'ERROR',
      message: resData.error,
    } as error.INetworkError;
  }

  return {
    type: 'REMOVE_COMPANY',
  } as types.IRemoveCompanyResponse;
};

export default {
  addCompany,
  getCompanies,
  getCompany,
  updateCompany,
  getUsersByCompany,
  removeCompany,
};

// const mapDtoToObject = async (companyDto: CompanyDto): Promise<ICompany> => {
//   let user = {} as IUser;

//   const res = await api.get<IResponse<IUser>>(`/users/${companyDto.adminId}`);
//   const adminDto = res.data;

//   if (adminDto.data) {
//     user = adminDto.data;
//   }

//   return {
//     ...companyDto,
//     admin: user,
//   };
// };
