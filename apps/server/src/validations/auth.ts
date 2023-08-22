import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

import * as urlValidation from './url';

const login: Config = {
  validate: {
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
      email: Joi.optional(),
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
      ...urlValidation.checkURL,
      deviceId: Joi.string().required().error(new InvalidParameterException('Не указано устройство')),
    }),
  },
};

const checkAccessCode: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      code: Joi.string().required().error(new InvalidParameterException('Не указан код доступа')),
      // adminId: Joi.string().required().error(new InvalidParameterException('Не указан администратор')),
    }),
  },
};

const getDeviceStatus: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указано устройство')),
    }),
  },
};

export { login, signup, verifyCode, getActivationCode, getDeviceStatus, checkAccessCode };
