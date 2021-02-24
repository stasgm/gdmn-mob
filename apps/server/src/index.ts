import Koa from 'koa';
import { init } from './server';

const run = async (): Promise<Koa<Koa.DefaultState, Koa.DefaultContext>> => {
  return await init();
};

if (!module.parent) {
  run().catch(err => {
    console.error('!!! SERVER DROPPED BY ERROR !!!');
    console.error(err instanceof Error || typeof err !== 'object' ? err : '!!! undefined error !!!');
    process.exit(1);
  });
}

export default run;
