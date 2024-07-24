import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

import { checkDateFormat } from '../utils';

import * as urlValidation from './url';

const getServerLog: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор файла логов сервера')),
    }),
  },
};

const getServerLogs: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
    }),
    query: Joi.object({
      ...urlValidation.checkURL,
      dateFrom: Joi.string().custom(checkDateFormat).optional(),
      dateTo: Joi.string().custom(checkDateFormat).optional(),
      mDateFrom: Joi.string().custom(checkDateFormat).optional(),
      mDateTo: Joi.string().custom(checkDateFormat).optional(),
      filterText: Joi.string().optional(),
      searchQuery: Joi.string().optional(),
    }),
  },
};

const deleteServerLog: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор файла лога')),
    }),
  },
};

const deleteServerLogs: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
    }),
    type: 'json',
    body: Joi.object({
      files: Joi.array().items(
        Joi.object({
          id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор файла лога')),
        }),
      ),
    }),
  },
};

export { getServerLog, getServerLogs, deleteServerLog, deleteServerLogs };
