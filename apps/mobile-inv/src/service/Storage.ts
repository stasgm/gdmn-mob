import { IBaseUrl } from '../../../common';
import config from '../config';
import { appStorage } from '../helpers/utils';

export default class Sync {
  /*   private path: string;

  setPath = (path: string) => {
    this.path = path;
  };
 */
  setServer = async (serverUrl: IBaseUrl) => {
    await appStorage.setItem('pathServer', serverUrl);
  };

  getServer = async () => {
    let pathSrv: IBaseUrl = await appStorage.getItem('pathServer');

    if (!(pathSrv instanceof Object && 'protocol' in pathSrv)) {
      pathSrv = {
        protocol: config.server.protocol,
        server: config.server.name,
        port: config.server.port,
        timeout: config.timeout,
        apiPath: config.apiPath,
      };
      await this.setServer(pathSrv);
    }

    return pathSrv;
  };

  setDeviceId = async (deviceId: string): Promise<void> => {
    await appStorage.setItem('deviceId', deviceId);
  };

  getDeviceId = async () => {
    const deviceId: string = await appStorage.getItem('deviceId');
    return deviceId;
  };
}
