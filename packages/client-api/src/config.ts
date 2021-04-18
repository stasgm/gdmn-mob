/*
import axios from 'axios';
import { device } from '@lib/mock';
import { config } from '@lib/client-config';

const {
  server: { name, port, protocol },
  debug,
  apiPath,
} = config;

export const deviceUid = debug.deviceId || device.uid;

const URL = `${protocol}${name}:${port}/${apiPath}`;

const params = { deviceId: deviceUid };

export const api = axios.create({
  baseURL: URL,
  params,
});
*/
