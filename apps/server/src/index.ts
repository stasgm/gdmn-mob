import config from '../config';

import { createServer, KoaApp, startServer } from './server';

import { IItemDatabase } from './utils/databaseMenu';

//import { readFile } from './utils/workWithFile';

const defaultDatabase: IItemDatabase = {
  name: 'DB',
  path: config.FILES_PATH,
  port: config.PORT,
};

const run = async (dbase?: IItemDatabase): Promise<KoaApp> => {
  // TODO
  /* if (dbase) {
    db = dbase;
  } else {
    const templateName: IItemDatabase[] | undefined = await readFile(config.TEMPLATE_CONFIG_NAME);
    const chosenDatabase = !templateName || templateName.length === 0 ? undefined : await databaseMenu(templateName);

    db = chosenDatabase ? JSON.parse(chosenDatabase) : defaultDatabase;
  } */
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
