import axios from 'axios';
import { config, device } from '@lib/mock';

const { port, protocol, server, apiPath } = config;

export const deviceId = device.uid;

const URL = `${protocol}${server}:${port}/${apiPath}`;

// const DEVICE_ID = 'WEB';

const params = { deviceId };

export const api = axios.create({
  baseURL: URL,
  params,
});
