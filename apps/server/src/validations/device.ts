import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

import * as urlValidation from './url';

const addDevice: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      name: Joi.string().required().error(new InvalidParameterException('Не указано наименование устройства')),
      state: Joi.string().required().error(new InvalidParameterException('Не указано статус устройства')),
    }),
    validateOptions: {
      allowUnknown: true,
    },
  },
};

const updateDevice: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор устройства')),
    }),
    type: 'json',
    body: Joi.object().required().error(new InvalidParameterException('Не указана информация об устройстве')),
  },
};

const removeDevice: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор устройства')),
    }),
  },
};

const getDevice: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор устройства')),
    }),
  },
};

const getUsersByDevice: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор устройства')),
    }),
  },
};

export { addDevice, updateDevice, removeDevice, getDevice, getUsersByDevice };
