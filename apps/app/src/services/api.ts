import axios from 'axios';
import { IResponse, IDevice, IUserCredentials, IUser } from '@lib/types';

const baseUrl = 'http://192.168.100.10:3649/api';
const deviceId = '111';

const api = axios.create({
  baseURL: baseUrl,
});

const apiService = {
  getDeviceByUser: async (userName: string): Promise<IResponse<IDevice>> =>
    api.post(`/devices/${deviceId}/user/${userName}`),
  login: async (userCredentials: IUserCredentials): Promise<IResponse<IUser | null>> =>
    api.post(`/auth/login?deviceId=${deviceId}/user`, {
      userName: userCredentials.userName,
      password: userCredentials.password,
    }),
  logout: async (): Promise<IResponse<undefined>> => api.post(`/auth/logout?deviceId=${deviceId}`),
};

export default apiService;
