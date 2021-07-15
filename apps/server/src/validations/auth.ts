import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

const login: Config = {
  validate: {
    /* query: {
      deviceId: Joi.string().required().error(new InvalidParameterException('Не указано устройство')),
    }, */
    type: 'json',
    body: Joi.object({
      name: Joi.string().required().error(new InvalidParameterException('Не заполнено имя пользователя')),
      password: Joi.string().required().error(new InvalidParameterException('Не заполнен пароль')),
    }),
  },
};

const signup: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      name: Joi.string().required().error(new InvalidParameterException('Не заполнено имя пользователя')),
      password: Joi.string().required().error(new InvalidParameterException('Не заполнен пароль')),
    }),
  },
};

const verifyCode: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      code: Joi.string().required().error(new InvalidParameterException('Не указан код активации')),
    }),
  },
};

const getActivationCode: Config = {
  validate: {
    params: Joi.object({
      deviceId: Joi.string().required().error(new InvalidParameterException('Не указано устройство')),
    }),
  },
};

const checkDevice: Config = {
  validate: {
    query: {
      deviceId: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор устройства')),
    },
  },
};

export { login, signup, verifyCode, getActivationCode, checkDevice };
