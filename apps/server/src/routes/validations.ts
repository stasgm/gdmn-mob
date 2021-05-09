import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

const login: Config = {
  validate: {
    query: {
      deviceId: Joi.string().required().error(new InvalidParameterException('не указано устройство')),
    },
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

const verifyCode: Config = {
  validate: {
    type: 'json',
    params: Joi.object({
      code: Joi.string().required().error(new InvalidParameterException('не указан код активации')),
    }),
  },
};

const getActivationCode: Config = {
  validate: {
    type: 'json',
    params: Joi.object({
      deviceId: Joi.string().required().error(new InvalidParameterException('не указано устройство')),
    }),
  },
};

const authValidation = { login, signup, verifyCode, getActivationCode };

export default { authValidation };
