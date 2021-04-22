import { AxiosInstance } from 'axios';
import { v4 as uuid } from 'uuid';

import { NewCompany, IResponse, IUser, ICompany } from '@lib/types';
import { user as mockUser, companies as mockCompanies } from '@lib/mock';

import { error, company as types } from '../types';
import { BaseApi } from '../requests/baseApi';
import { sleep } from '../utils';

const isMock = process.env.MOCK;
const mockTimeout = 500;

class Company extends BaseApi {
  constructor(api: AxiosInstance, deviceId: string) {
    super(api, deviceId);
  }

  addCompany = async (company: NewCompany) => {
    if (isMock) {
      await sleep(mockTimeout);

      return {
        type: 'ADD_COMPANY',
        company: { ...company, admin: mockUser, id: uuid() },
      } as types.IAddCompanyResponse;
    }

    const res = await this.api.post<IResponse<ICompany>>('/companies', company);
    const resData = res.data;

    if (resData.result) {
      return {
        type: 'ADD_COMPANY',
        company: resData.data,
      } as types.IAddCompanyResponse;
    }

    return {
      type: 'ERROR',
      message: resData.error,
    } as error.INetworkError;
  };

  getCompanies = async () => {
    if (isMock) {
      await sleep(mockTimeout);

      return {
        type: 'GET_COMPANIES',
        companies: mockCompanies,
      } as types.IGetCompaniesResponse;
    }

    const res = await this.api.get<IResponse<ICompany[]>>('/companies');
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

  getCompany = async (companyId: string) => {
    if (isMock) {
      await sleep(mockTimeout);
      const company = mockCompanies.find((item) => item.id === companyId);

      if (company) {
        return {
          type: 'GET_COMPANY',
          company,
        } as types.IGetCompanyResponse;
      }

      return {
        type: 'ERROR',
        message: 'Компания не найдена',
      } as error.INetworkError;
    }

    const res = await this.api.get<IResponse<ICompany>>(`/companies/${companyId}`);
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

  updateCompany = async (company: Partial<ICompany>) => {
    if (isMock) {
      await sleep(mockTimeout);
      const updatedCompany = mockCompanies.find((item) => item.id === company.id);

      if (updatedCompany) {
        return {
          type: 'UPDATE_COMPANY',
          company: updatedCompany,
        } as types.IUpdateCompanyResponse;
      }

      return {
        type: 'ERROR',
        message: 'Компания не найдена',
      } as error.INetworkError;
    }

    const res = await this.api.patch<IResponse<ICompany>>(`/companies/${company.id}`, company);
    const resData = res.data;

    if (resData.result) {
      return {
        type: 'UPDATE_COMPANY',
        company: resData.data,
      } as types.IUpdateCompanyResponse;
    }

    return {
      type: 'ERROR',
      message: resData.error,
    } as error.INetworkError;
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
    if (isMock) {
      await sleep(mockTimeout);

      return {
        type: 'REMOVE_COMPANY',
      } as types.IRemoveCompanyResponse;
    }

    const res = await this.api.delete<IResponse<void>>(`/companies/${companyId}`);
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
