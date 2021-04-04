import axios from 'axios';
import { config, device, systemName } from '@lib/store/mock';
export { systemName };
// export const deviceId = '123-456-789';

// const PROTOCOL = 'http';
// const HOST = 'localhost';
// const PORT = '3649';
// const PREFIX = 'api';
// const URL = `${PROTOCOL}://${HOST}:${PORT}/${PREFIX}`;
const { port, protocol, server, apiPath } = config;
const { uid } = device;

const URL = `${protocol}${server}:${port}/${apiPath}`;

console.log(URL);
// const DEVICE_ID = 'WEB';

const params = { deviceId: uid };

export const api = axios.create({
  baseURL: URL,
  params,
});
