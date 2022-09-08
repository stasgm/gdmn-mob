import config from '../config';

import { createServer, KoaApp, startServer } from './server';

export interface IItemDatabase {
  name: string;
  path: string;
  port: number;
}

const defaultDatabase: IItemDatabase = {
  name: 'DB',
  path: config.FILES_PATH,
  port: config.PORT,
};

const run = async (dbase?: IItemDatabase): Promise<KoaApp> => {
  const db: IItemDatabase = dbase ?? defaultDatabase;

  const app = await createServer({ name: 'WS-Server', dbName: db.name, dbPath: db.path, port: db.port });

  startServer(app);

  return app;
};

if (module.children) {
  run().catch((err) => {
    console.error('!!! SERVER DROPPED BY ERROR !!!');
    console.error(err instanceof Error || typeof err !== 'object' ? err : '!!! undefined error !!!');
    process.exit(1);
  });
}

export default run;
