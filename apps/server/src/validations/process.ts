import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

import * as urlValidation from './url';

const addProcess: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      companyId: Joi.string().required().error(new InvalidParameterException('Не указана компания')),
      appSystem: Joi.string().required().error(new InvalidParameterException('Не указана подсистема приложения')),
    }),
  },
};

const updateProcess: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор процесса')),
    }),
    type: 'json',
    body: Joi.object({
      head: Joi.object({
        company: Joi.object({
          id: Joi.string().required().error(new InvalidParameterException('Некорректный формат сообщения')),
          name: Joi.string().required().error(new InvalidParameterException('Некорректный формат сообщения')),
        }),
        appSystem: Joi.string().optional(),
        producer: Joi.object().optional(),
        consumer: Joi.object().optional(),
        version: Joi.number().optional(),
        dateTime: Joi.string().optional(),
      }),
      body: Joi.object({
        type: Joi.string().required().error(new InvalidParameterException('Некорректный формат сообщения')),
        version: Joi.number().optional(),
        payload: Joi.alternatives()
          .try(Joi.object(), Joi.array())
          .required()
          .error(new InvalidParameterException('Некорректный формат сообщения')),
      }),
      id: Joi.string().optional(),
      status: Joi.string().optional(),
    }),
  },
};

const removeProcess: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор устройства')),
    }),
  },
};

const cancelProcess: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор устройства')),
    }),
    type: 'json',
    body: Joi.object({
      errorMessage: Joi.string().required().error(new InvalidParameterException('Не указана причина отмены')),
    }),
  },
};

const breakProcess: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор устройства')),
    }),
    type: 'json',
    body: Joi.object({
      errorMessage: Joi.string()
        .required()
        .error(new InvalidParameterException('Не указана причина прерывания процесса')),
    }),
  },
};

export { addProcess, updateProcess, removeProcess, cancelProcess, breakProcess };
