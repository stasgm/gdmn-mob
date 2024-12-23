import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

import * as urlValidation from './url';

const addAppSystem: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      name: Joi.string().required().error(new InvalidParameterException('Не указано наименование подсистемы')),
      description: Joi.string().allow('', null),
      appVersion: Joi.string().allow('', null),
    }),
  },
};

const updateAppSystem: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор подсистемы')),
    }),
    type: 'json',
    body: Joi.object().required().error(new InvalidParameterException('Не указана информация о подсистеме')),
  },
};

const removeAppSystem: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор подсистемы')),
    }),
  },
};

const getAppSystem: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор подсистемы')),
    }),
  },
};

export { addAppSystem, updateAppSystem, removeAppSystem, getAppSystem };
