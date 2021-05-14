import { v4 as uuid } from 'uuid';

import { NewCompany, IResponse, ICompany } from '@lib/types';
import { user as mockUser, companies as mockCompanies } from '@lib/mock';

import { error, company as types } from '../types';
import { getParams, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';

const isMock = process.env.MOCK;
const mockTimeout = 500;

class Company extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  addCompany = async (company: NewCompany) => {
    if (isMock) {
      await sleep(mockTimeout);

      return {
        type: 'ADD_COMPANY',
        company: { ...company, admin: mockUser, id: uuid() },
      } as types.IAddCompanyResponse;
    }

    try {
      const res = await this.api.axios.post<IResponse<ICompany>>('/companies', company);
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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err?.response?.data || 'Oops, Something Went Wrong',
      } as error.INetworkError;
    }
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

    try {
      const res = await this.api.axios.patch<IResponse<ICompany>>(`/companies/${company.id}`, company);
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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err?.response?.data || 'Oops, Something Went Wrong',
      } as error.INetworkError;
    }
  };

  removeCompany = async (companyId: string) => {
    if (isMock) {
      await sleep(mockTimeout);

      return {
        type: 'REMOVE_COMPANY',
      } as types.IRemoveCompanyResponse;
    }

    try {
      const res = await this.api.axios.delete<IResponse<void>>(`/companies/${companyId}`);
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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err?.response?.data || 'Oops, Something Went Wrong',
      } as error.INetworkError;
    }
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
    try {
      const res = await this.api.axios.get<IResponse<ICompany>>(`/companies/${companyId}`);
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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err?.response?.data || 'Oops, Something Went Wrong',
      } as error.INetworkError;
    }
  };

  getCompanies = async (params?: Record<string, string>) => {
    if (isMock) {
      await sleep(mockTimeout);

      return {
        type: 'GET_COMPANIES',
        companies: mockCompanies,
      } as types.IGetCompaniesResponse;
    }

    let paramText = params ? getParams(params) : '';

    if (paramText > '') {
      paramText = `?${paramText}`;
    }

    try {
      const res = await this.api.axios.get<IResponse<ICompany[]>>(`/companies${paramText}`);
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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err?.response?.data || 'Oops, Something Went Wrong',
      } as error.INetworkError;
    }
  };

  // getUsersByCompany = async (companyId: string) => {
  //   const res = await this.api.axios.get<IResponse<IUser[]>>(`/companies/${companyId}/users`);
  //   const resData = res.data;

  //   if (resData.result) {
  //     return {
  //       type: 'GET_USERS_BY_COMPANY',
  //       users: resData.data,
  //     } as types.IGetCompanyUsersResponse;
  //   }
  //   return {
  //     type: 'ERROR',
  //     message: resData.error,
  //   } as error.INetworkError;
  // };
}

export default Company;

// const mapDtoToObject = async (companyDto: CompanyDto): Promise<ICompany> => {
//   let user = {} as IUser;

//   const res = await this.api.axios.get<IResponse<IUser>>(`/users/${companyDto.adminId}`);
//   const adminDto = res.data;

//   if (adminDto.data) {
//     user = adminDto.data;
//   }

//   return {
//     ...companyDto,
//     admin: user,
//   };
// };
