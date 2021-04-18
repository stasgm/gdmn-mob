import { AxiosInstance } from 'axios';

import { NewCompany, IResponse, IUser, ICompany } from '@lib/types';

import { error, company as types } from '../types';
import { BaseApi } from '../requests/baseApi';

class Company extends BaseApi {
  constructor(api: AxiosInstance, deviceId: string) {
    super(api, deviceId);
  }

  addCompany = async (newCompany: NewCompany) => {
    const res = await this.api.post<IResponse<ICompany>>('/companies', newCompany);
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

  getCompanies = async () => {
    const res = await this.api.get<IResponse<ICompany[]>>('/companies');
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

  getCompany = async (companyId: string) => {
    const res = await this.api.get<IResponse<ICompany>>(`/companies/${companyId}`);
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

  updateCompany = async (object: Partial<ICompany>) => {
    const res = await this.api.patch<IResponse<ICompany>>(`/companies/${object.id}`, object);
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

  getUsersByCompany = async (companyId: string) => {
    const res = await this.api.get<IResponse<IUser[]>>(`/companies/${companyId}/users`);
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

  removeCompany = async (companyId: string) => {
    const res = await this.api.delete<IResponse<void>>(`/companies/${companyId}`);
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
}

export default Company;

// const mapDtoToObject = async (companyDto: CompanyDto): Promise<ICompany> => {
//   let user = {} as IUser;

//   const res = await this.api.get<IResponse<IUser>>(`/users/${companyDto.adminId}`);
//   const adminDto = res.data;

//   if (adminDto.data) {
//     user = adminDto.data;
//   }

//   return {
//     ...companyDto,
//     admin: user,
//   };
// };
