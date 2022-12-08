import { NewCompany, ICompany } from '@lib/types';
import { user as mockUser, companies as mockCompanies } from '@lib/mock';

import { error, company as types } from '../types';
import { generateId, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';
import { CustomRequest } from '../robustRequest';

class Company extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  addCompany = async (customRequest: CustomRequest, company: NewCompany) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ADD_COMPANY',
        company: {
          ...company,
          admin: mockUser,
          id: generateId(),
          editionDate: new Date().toISOString(),
          creationDate: new Date().toISOString(),
        },
      } as types.IAddCompanyResponse;
    }

    const res = await customRequest<ICompany>({
      api: this.api.axios,
      method: 'POST',
      url: '/companies',
      data: company,
    });

    if (res?.result) {
      return {
        type: 'ADD_COMPANY',
        company: res?.data,
      } as types.IAddCompanyResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'компания не создана',
    } as error.IServerError;
  };

  updateCompany = async (customRequest: CustomRequest, company: Partial<ICompany>) => {
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
      } as error.IServerError;
    }

    const res = await customRequest<ICompany>({
      api: this.api.axios,
      method: 'PATCH',
      url: `/companies/${company.id}`,
      data: company,
    });

    if (res?.result) {
      return {
        type: 'UPDATE_COMPANY',
        company: res.data,
      } as types.IUpdateCompanyResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'компания не обновлена',
    } as error.IServerError;
  };

  removeCompany = async (customRequest: CustomRequest, companyId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_COMPANY',
      } as types.IRemoveCompanyResponse;
    }

    const res = await customRequest<void>({
      api: this.api.axios,
      method: 'DELETE',
      url: `/companies/${companyId}`,
    });

    if (res?.result) {
      return {
        type: 'REMOVE_COMPANY',
      } as types.IRemoveCompanyResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'компания не удалена',
    } as error.IServerError;
  };

  getCompany = async (customRequest: CustomRequest, companyId: string) => {
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
        message: 'данные о компании не получены',
      } as error.IServerError;
    }

    const res = await customRequest<ICompany>({ api: this.api.axios, method: 'GET', url: `/companies/${companyId}` });

    if (res?.result) {
      return {
        type: 'GET_COMPANY',
        company: res.data,
      } as types.IGetCompanyResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'данные о компании не получены',
    } as error.IServerError;
  };

  getCompanies = async (customRequest: CustomRequest, params?: Record<string, string | number>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_COMPANIES',
        companies: mockCompanies,
      } as types.IGetCompaniesResponse;
    }

    const res = await customRequest<ICompany[]>({ api: this.api.axios, method: 'GET', url: '/companies', params });

    if (res?.result) {
      return {
        type: 'GET_COMPANIES',
        companies: res.data,
      } as types.IGetCompaniesResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'данные о компаниях не получены',
    } as error.IServerError;
  };
}

export default Company;
