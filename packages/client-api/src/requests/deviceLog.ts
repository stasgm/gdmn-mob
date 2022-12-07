import { IDeviceLog } from '@lib/types';

import { error, deviceLog as types } from '../types';
import { sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';
import { CustomRequest } from '../robustRequest';

class DeviceLog extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  addDeviceLog = async (
    customRequest: CustomRequest,
    companyId: string,
    appSystemId: string,
    deviceLog: IDeviceLog[],
  ) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ADD_DEVICELOG',
      } as types.IAddDeviceLogResponse;
    }

    const body = {
      companyId,
      appSystemId,
      deviceLog,
    };

    const res = await customRequest<void>({
      api: this.api.axios,
      method: 'POST',
      url: '/deviceLogs',
      data: body,
    });

    if (res?.result) {
      return {
        type: 'ADD_DEVICELOG',
      } as types.IAddDeviceLogResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'журнал ошибок устройства не отправлен',
    } as error.IServerError;
  };
}
export default DeviceLog;
