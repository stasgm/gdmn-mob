import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

const login: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      name: Joi.string().required().error(new InvalidParameterException('не заполнено имя пользователя')),
      password: Joi.string().required().error(new InvalidParameterException('не заполнен пароль')),
    }),
  },
};

const signup: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      name: Joi.string().required().error(new InvalidParameterException('не заполнено имя пользователя')),
      password: Joi.string().required().error(new InvalidParameterException('не заполнен пароль')),
    }),
  },
};

const authValidation = { login, signup };

export default { authValidation };
