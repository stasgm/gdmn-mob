import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

import * as urlValidation from './url';

const bindingDevice: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      device: Joi.object().required().error(new InvalidParameterException('Не указан идентификатор устройства')),
      user: Joi.object().required().error(new InvalidParameterException('Не указан идентификатор пользователя')),
      state: Joi.string().optional(),
    }),
  },
};

const updateDeviceBinding: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор связи')),
    }),
    type: 'json',
    body: Joi.object().required().error(new InvalidParameterException('Не указана информация о связи с устройством')),
  },
};

const getDeviceBinding: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор связи')),
    }),
  },
};

export { bindingDevice, getDeviceBinding, updateDeviceBinding };
