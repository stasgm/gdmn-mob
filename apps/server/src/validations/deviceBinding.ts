import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

const bindingDevice: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      deviceId: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор устройства')),
      userId: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор пользователя')),
    }),
  },
};

const updateDeviceBinding: Config = {
  validate: {
    params: Joi.object({
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор связи')),
    }),
    type: 'json',
    body: Joi.object().required().error(new InvalidParameterException('Не указана информация о связи с устройством')),
  },
};

const getDeviceBinding: Config = {
  validate: {
    params: Joi.object({
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор связи')),
    }),
  },
};

export { bindingDevice, getDeviceBinding, updateDeviceBinding };
