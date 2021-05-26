import Koa from 'koa';

import config from '../config';

import log from './utils/logger';

import { init } from './server';

import { IItemDatabase, databaseMenu } from './utils/databaseMenu';

import { readFile } from './utils/workWithFile';

const run = async (dbase?: IItemDatabase): Promise<Koa<Koa.DefaultState, Koa.DefaultContext>> => {
  // TODO
  let db: IItemDatabase;
  console.log(dbase);
  if (dbase) {
    db = dbase;
  } else {
    const templateName: IItemDatabase[] | undefined = await readFile(config.TEMPLATE_CONFIG_NAME);
    const chosenDatabase = !templateName || templateName.length === 0 ? undefined : await databaseMenu(templateName);
    const defaultDatabase = {
      name: 'DB',
      database: config.FILES_PATH,
      port: config.PORT,
    };

    db = chosenDatabase ? JSON.parse(chosenDatabase) : defaultDatabase;
  }

  const app = await init(db);
  app.listen(db.port);
  log.info(`Server is running on http://localhost:${db.port}`);

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
