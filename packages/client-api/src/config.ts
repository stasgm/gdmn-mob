import axios from 'axios';

export const deviceId = '123';
export const systemName = 'Inventory';
const PROTOCOL = 'http';
const HOST = 'localhost';
const PORT = '3649';
const PREFIX = 'api';
const URL = `${PROTOCOL}://${HOST}:${PORT}/${PREFIX}`;
const DEVICE_ID = 'WEB';

const params = { deviceId: DEVICE_ID };

export const api = axios.create({
  baseURL: URL,
  params,
});
