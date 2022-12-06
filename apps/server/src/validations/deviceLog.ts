import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

import * as urlValidation from './url';

const addDeviceLog: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
    }),
    type: 'json',
    body: Joi.object({
      companyId: Joi.string().required().error(new InvalidParameterException('Не указана организация')),
      appSystemId: Joi.string().required().error(new InvalidParameterException('Не указана подсистема')),
      deviceLog: Joi.array().items(
        Joi.object({
          name: Joi.string().required().error(new InvalidParameterException('Не указан наименование метода')),
          date: Joi.string().required().error(new InvalidParameterException('Не указана дата ошибки')),
          id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор')),
          message: Joi.string().required().error(new InvalidParameterException('Не указан текст ошибки')),
        }),
      ),
    }),
  },
};

const removeDeviceLog: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор файла логов  ошибок')),
    }),
  },
};

const getDeviceLog: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор файла логов  ошибок')),
    }),
  },
};

export { addDeviceLog, removeDeviceLog, getDeviceLog };
