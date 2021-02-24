import {
  IResponse,
  IUser,
  IDevice,
  IBaseUrl,
  IMessageInfo,
  IMessage,
  IDocument,
  IReference,
  IRem,
  IGood,
  IUserCredentials,
} from '../../../common';
import config from '../config';
import { get, post, remove } from './http.service';

export default class Api {
  baseUrl: IBaseUrl;
  deviceId: string;

  setUrl = (url: IBaseUrl) => {
    this.baseUrl = url;
  };

  setDeviceId = (deviceId: string) => {
    this.deviceId = deviceId;
  };

  getUrl = () => `${this.baseUrl.protocol}${this.baseUrl.server}:${this.baseUrl.port}/${this.baseUrl.apiPath}`;

  auth = {
    login: async (userCredentials: IUserCredentials): Promise<IResponse<undefined>> =>
      post(
        this.getUrl(),
        `/auth/login?deviceId=${this.deviceId}`,
        JSON.stringify({ userName: userCredentials.userName, password: userCredentials.password }),
      ),
    logout: async (): Promise<IResponse<undefined>> => get(this.getUrl(), `/auth/logout?deviceId=${this.deviceId}`),

    getUserStatus: async (): Promise<IResponse<IUser>> => get(this.getUrl(), `/auth/user?deviceId=${this.deviceId}`),

    getUserProfile: async (id: string): Promise<IResponse<IUser>> =>
      get(this.getUrl(), `/users/${id}?deviceId=${this.deviceId}`),

    /* Проверка устройства - есть ли в базе сервера */
    getDevice: async (): Promise<IResponse<IDevice>> => get(this.getUrl(), `/devices/${this.deviceId}`),

    /* Проверка устройства по пользователю - есть ли в базе сервера */
    getDeviceByUser: async (userName: string): Promise<IResponse<IDevice>> =>
      get(this.getUrl(), `/devices/${this.deviceId}/user/${userName}`),

    verifyActivationCode: async (code: string): Promise<IResponse<string>> =>
      post(this.getUrl(), '/auth/device/code', JSON.stringify({ uid: this.deviceId, code })),

    // //TODO: избавиться от роута
    // addDevice: async (newDevice: INewDevice): Promise<IResponse<IDevice>> =>
    //   post(this.getUrl(), '/devices/', JSON.stringify({ uid: newDevice.uid, user: newDevice.user })),
  };

  data = {
    getData: async (): Promise<IResponse<(IDocument | IReference | IRem | IGood)[]>> => get(this.getUrl(), '/test/all'),

    sendMessages: async (
      companyId: string,
      consumer: string,
      body: IMessage['body'],
    ): Promise<IResponse<IMessageInfo>> =>
      post(
        this.getUrl(),
        `/messages?deviceId=${this.deviceId}`,
        JSON.stringify({ head: { companyId, consumer, appSystem: config.system[0].name }, body }),
      ),

    getMessages: async (companyId: string): Promise<IResponse<IMessage[]>> =>
      get(this.getUrl(), `/messages/${companyId}/${config.system[0].name}?deviceId=${this.deviceId}`),

    deleteMessage: async (companyId: string, uid: string): Promise<IResponse<void>> =>
      remove(this.getUrl(), `/messages/${companyId}/${uid}?deviceId=${this.deviceId}`),

    subscribe: async (companyId: string): Promise<IResponse<IMessage[]>> =>
      get(this.getUrl(), `/messages/subscribe/${companyId}/${config.system[0].name}?deviceId=${this.deviceId}`),

    publish: async (companyId: string, consumer: string, body: IMessage['body']): Promise<IResponse<IMessageInfo>> =>
      post(
        this.getUrl(),
        `/messages/publish/${companyId}?deviceId=${this.deviceId}`,
        JSON.stringify({ head: { companyId, consumer }, body }),
      ),
  };
}
