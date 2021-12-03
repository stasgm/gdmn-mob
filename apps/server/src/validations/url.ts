import { Joi } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

const checkURL = {
  version: Joi.string().required().error(new InvalidParameterException('Неизвестная версия приложения')),
};

export { checkURL };
