import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

const addDevice: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      deviceName: Joi.string().required().error(new InvalidParameterException('Не указано наименование устройства')),
      userId: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор пользователя')),
    }),
  },
};

const updateDevice: Config = {
  validate: {
    params: Joi.object({
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор устройства')),
    }),
    type: 'json',
    body: Joi.object().required().error(new InvalidParameterException('Не указана информация об устройстве')),
  },
};

const removeDevice: Config = {
  validate: {
    params: Joi.object({
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор устройства')),
    }),
  },
};

const getDevice: Config = {
  validate: {
    params: Joi.object({
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор устройства')),
    }),
  },
};

const getUsersByDevice: Config = {
  validate: {
    params: Joi.object({
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор устройства')),
    }),
  },
};
export { addDevice, updateDevice, removeDevice, getDevice, getUsersByDevice };
