import axios from 'axios';
import { IResponse, IDevice, IUserCredentials, IUser } from '@lib/types';

import { config, device } from '../screens/constants';

const baseUrl = `${config.protocol}${config.server}:${config.port}/${config.apiPath}`;

const api = axios.create({
  baseURL: baseUrl,
});

const deviceId = device.id || '111';

const apiService = {
  getDeviceByUser: async (userName: string): Promise<IResponse<IDevice>> =>
    api.post(`/devices/${deviceId}/user/${userName}`),

  getUserStatus: async (): Promise<IResponse<IUser>> => api.get(`/auth/user?deviceId=${deviceId}`),

  getUserProfile: async (id: string): Promise<IResponse<IUser>> => api.get(`/users/${id}?deviceId=${deviceId}`),

  getDevice: async (): Promise<IResponse<IDevice>> => api.get(`/devices/${deviceId}`),

  verifyActivationCode: async (code: string): Promise<IResponse<IDevice>> =>
    api.post('/auth/device/code', JSON.stringify({ uid: deviceId, code })),

  login: async (userCredentials: IUserCredentials): Promise<IResponse<IUser | null>> =>
    api.post(`/auth/login?deviceId=${deviceId}/user`, {
      userName: userCredentials.userName,
      password: userCredentials.password,
    }),

  logout: async (): Promise<IResponse<undefined>> => api.post(`/auth/logout?deviceId=${deviceId}`),
};

export default apiService;
