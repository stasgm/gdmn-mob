import { createNativeClient, getDefaultLibraryFilename } from 'node-firebird-driver-native';

import { dbOptions } from './config/firebird';

const client = createNativeClient(getDefaultLibraryFilename());

export const attach = () =>
  client.connect(`${dbOptions.server?.host}/${dbOptions.server?.port}:${dbOptions.path}`, {
    username: dbOptions.username,
    password: dbOptions.password,
  });
