import Koa from 'koa';

import config from '../config';

import { init } from './server';

import { IItemDatabase, databaseMenu } from './utils/databaseMenu';

import { readFile } from './utils/workWithFile';

const run = async (): Promise<Koa<Koa.DefaultState, Koa.DefaultContext>> => {
  const templateName: IItemDatabase[] | undefined = await readFile(config.TEMPLATE_CONFIG_NAME);
  const chosenDatabase = !templateName || templateName.length === 0 ? undefined : await databaseMenu(templateName);
  const defaultDatabase = {
    name: 'DB',
    database: config.FILES_PATH,
    port: config.PORT,
  };
  const db: IItemDatabase = chosenDatabase ? JSON.parse(chosenDatabase) : defaultDatabase;
  return init(db);
};
if (module.children) {
  run().catch((err) => {
    console.error('!!! SERVER DROPPED BY ERROR !!!');
    console.error(err instanceof Error || typeof err !== 'object' ? err : '!!! undefined error !!!');
    process.exit(1);
  });
}

export default run;
