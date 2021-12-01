import { v4 as uuid } from 'uuid';

import { NewCompany, IResponse, ICompany } from '@lib/types';
import { user as mockUser, companies as mockCompanies } from '@lib/mock';

import { error, company as types } from '../types';
import { getParams, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';

class Company extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  addCompany = async (company: NewCompany) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ADD_COMPANY',
        company: {
          ...company,
          admin: mockUser,
          id: uuid(),
          editionDate: new Date().toISOString(),
          creationDate: new Date().toISOString(),
        },
      } as types.IAddCompanyResponse;
    }

    const res = await this.api.axios.post<IResponse<ICompany>>('/companies', company);
    const resData = res.data;

    if (resData?.result) {
      return {
        type: 'ADD_COMPANY',
        company: resData?.data,
      } as types.IAddCompanyResponse;
    }

    return {
      type: 'ERROR',
      message: resData.error,
    } as error.INetworkError;
    // } catch (err) {
    //   return {
    //     type: 'ERROR',
    //     message: err?.response?.data?.error || 'ошибка создания компании',
    //   } as error.INetworkError;
    // }
  };

  updateCompany = async (company: Partial<ICompany>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      const updatedCompany = mockCompanies.find((item) => item.id === company.id);

      if (updatedCompany) {
        return {
          type: 'UPDATE_COMPANY',
          company: { ...updatedCompany, editionDate: new Date().toISOString() },
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
        message: err instanceof TypeError ? err.message : 'ошибка обновления компании',
        //err?.response?.data?.error || 'ошибка обновления компании',
      } as error.INetworkError;
    }
  };

  removeCompany = async (companyId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

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
        message: err instanceof TypeError ? err.message : 'ошибка удаления компании',
        //err?.response?.data?.error || 'ошибка удаления компании',
      } as error.INetworkError;
    }
  };

  getCompany = async (companyId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

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
        message: err instanceof TypeError ? err.message : 'ошибка получения данных о компании',
        //err?.response?.data?.error || 'ошибка получения данных о компании',
      } as error.INetworkError;
    }
  };

  getCompanies = async (params?: Record<string, string | number>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

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
      ///${this.api.config.version}
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
        message: err instanceof TypeError ? err.message : 'ошибка получения данных о компаниях',
        //err?.response?.data?.error || 'ошибка получения данных о компаниях',
      } as error.INetworkError;
    }
  };
}

export default Company;
