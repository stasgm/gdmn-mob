import { error, erpLog as types, BaseApi, BaseRequest } from '../types';
import { response2Log, sleep } from '../utils';
import { CustomRequest } from '../robustRequest';

class ErpLog extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  getErpLog = async (customRequest: CustomRequest, id: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ERROR',
        message: 'Лог не найден',
      } as error.IServerError;
    }

    const res = await customRequest<string>({
      api: this.api.axios,
      method: 'GET',
      url: `/erpLogs/${id}`,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_ERPLOG',
        erpLog: res?.data,
      } as types.IGetErpLogResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Данные файла не получены',
    } as error.IServerError;
  };
}

export default ErpLog;
