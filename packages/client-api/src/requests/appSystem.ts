// import { v4 as uuid } from 'uuid';

import { IResponse, IAppSystem } from '@lib/types';

import { error, appSystem as types } from '../types';
import { getParams } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';

class AppSystem extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  // getCompany = async (companyId: string) => {
  //   if (this.api.config.debug?.isMock) {
  //     await sleep(this.api.config.debug?.mockDelay || 0);

  //     const company = mockCompanies.find((item) => item.id === companyId);

  //     if (company) {
  //       return {
  //         type: 'GET_COMPANY',
  //         company,
  //       } as types.IGetCompanyResponse;
  //     }

  //     return {
  //       type: 'ERROR',
  //       message: 'Компания не найдена',
  //     } as error.INetworkError;
  //   }
  //   try {
  //     const res = await this.api.axios.get<IResponse<ICompany>>(`/companies/${companyId}`);
  //     const resData = res.data;

  //     if (resData.result) {
  //       return {
  //         type: 'GET_COMPANY',
  //         company: resData.data,
  //       } as types.IGetCompanyResponse;
  //     }

  //     return {
  //       type: 'ERROR',
  //       message: resData.error,
  //     } as error.INetworkError;
  //   } catch (err) {
  //     return {
  //       type: 'ERROR',
  //       message: err instanceof TypeError ? err.message : 'ошибка получения данных о компании',
  //       //err?.response?.data?.error || 'ошибка получения данных о компании',
  //     } as error.INetworkError;
  //   }
  // };

  getAppSystems = async (params?: Record<string, string | number>) => {
    // if (this.api.config.debug?.isMock) {
    //   await sleep(this.api.config.debug?.mockDelay || 0);

    //   return {
    //     type: 'GET_APP_SYSTEMS',
    //     companies: mockCompanies,
    //   } as types.IAppSystemQueryResponse;
    // }

    let paramText = params ? getParams(params) : '';

    if (paramText > '') {
      paramText = `?${paramText}`;
    }

    try {
      const res = await this.api.axios.get<IResponse<IAppSystem[]>>(`/appSystems${paramText}`);
      ///${this.api.config.version}
      const resData = res.data;
      console.log('resData', resData);

      if (resData.result) {
        return {
          type: 'GET_APP_SYSTEMS',
          appSystems: resData.data,
        } as types.IGetAppSystemsResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка получения данных о системах',
        //err?.response?.data?.error || 'ошибка получения данных о компаниях',
      } as error.INetworkError;
    }
  };
}

export default AppSystem;
