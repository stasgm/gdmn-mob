export const deviceStates = {
  'NON-REGISTERED': 'Не зарегистрировано',
  'NON-ACTIVATED': 'Не активно',
  ACTIVE: 'Активно',
  BLOCKED: 'Заблокировано',
};

export const adminPath = '/admin';

export const messageFolders = ['messages', 'error', 'prepared', 'log', 'unknown', 'deviceLogs'];

export const BYTES_PER_MB = 1024 ** 2;
export const BYTES_PER_KB = 1024;
export const MSEС_IN_MIN = 60000;
export const MSEС_IN_DAY = 86400000;

export const defMaxDataVolume = 20; // Mb
export const defMaxFiles = 10;
export const defMaxFilesSize = 50; //Mb

export const collectionNames = {
  users: 'users',
  devices: 'devices',
  companies: 'companies',
  codes: 'activation-codes',
  deviceBindings: 'device-bindings',
  appSystems: 'app-systems',
  sessionId: 'session-id',
};
