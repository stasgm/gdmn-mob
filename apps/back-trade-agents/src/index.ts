import express, { json } from 'express';

import environment from './config/environment';
import router from './routers';
import errorMiddleware from './middlewares/errorMiddleware';
import authMiddleware from './middlewares/authMiddleware';

const app = express();
app.use(json());
app.use(authMiddleware);
app.use('/v1', router);
app.use(errorMiddleware);

const startApp = async () => {
  try {
    app.listen(environment.PORT, () => console.log('SERVER STARTED ON PORT ' + environment.PORT));
  } catch (e) {
    console.log(e);
  }
};

startApp();
