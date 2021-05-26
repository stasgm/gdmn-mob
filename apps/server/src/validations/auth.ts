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
    params: Joi.object({
      code: Joi.string().required().error(new InvalidParameterException('не указан код активации')),
    }),
  },
};

const getActivationCode: Config = {
  validate: {
    params: Joi.object({
      deviceId: Joi.string().required().error(new InvalidParameterException('не указано устройство')),
    }),
  },
};

const checkDevice: Config = {
  validate: {
    query: {
      deviceId: Joi.string().required().error(new InvalidParameterException('не указан идентификатор устройства')),
    },
  },
};

export { login, signup, verifyCode, getActivationCode, checkDevice };
