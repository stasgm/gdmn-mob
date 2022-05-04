import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

import * as urlValidation from './url';

const addProcess: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
    }),
    type: 'json',
    body: Joi.object({
      companyId: Joi.string().required().error(new InvalidParameterException('Не указана компания')),
      appSystem: Joi.string().required().error(new InvalidParameterException('Не указана подсистема приложения')),
      maxFiles: Joi.number().optional(),
      maxDataVolume: Joi.number().optional(),
      producerIds: Joi.array().optional(),
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
      files: Joi.array().required().error(new InvalidParameterException('Не указан список файлов')),
    }),
  },
};

const prepareProcess: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор процесса')),
    }),
    type: 'json',
    body: Joi.object().required().error(new InvalidParameterException('Не указан список обработанных файлов')),
    //   head: Joi.object({
    //     company: Joi.object({
    //       id: Joi.string().required().error(new InvalidParameterException('Некорректный формат сообщения')),
    //       name: Joi.string().required().error(new InvalidParameterException('Некорректный формат сообщения')),
    //     }),
    //     appSystem: Joi.string().optional(),
    //     producer: Joi.object().optional(),
    //     consumer: Joi.object().optional(),
    //     version: Joi.number().optional(),
    //     dateTime: Joi.string().optional(),
    //   }),
    //   body: Joi.object({
    //     type: Joi.string().required().error(new InvalidParameterException('Некорректный формат сообщения')),
    //     version: Joi.number().optional(),
    //     payload: Joi.alternatives()
    //       .try(Joi.object(), Joi.array())
    //       .required()
    //       .error(new InvalidParameterException('Некорректный формат сообщения')),
    //   }),
    //   id: Joi.string().optional(),
    //   status: Joi.string().optional(),
    // }),
  },
};

const completeProcess: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор процесса')),
    }),
  },
};

const cancelProcess: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор процесса')),
    }),
    type: 'json',
    body: Joi.object({
      errorMessage: Joi.string().required().error(new InvalidParameterException('Не указана причина отмены процесса')),
    }),
  },
};

const interruptProcess: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор процесса')),
    }),
    type: 'json',
    body: Joi.object({
      errorMessage: Joi.string()
        .required()
        .error(new InvalidParameterException('Не указана причина прерывания процесса')),
    }),
  },
};

const getProcesses: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      companyId: Joi.string().optional(),
      appSystem: Joi.string().optional(),
    }),
  },
};

const deleteProcess: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор процесса')),
    }),
  },
};

export {
  addProcess,
  updateProcess,
  prepareProcess,
  completeProcess,
  cancelProcess,
  interruptProcess,
  getProcesses,
  deleteProcess,
};
