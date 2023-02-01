import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

import * as urlValidation from './url';

const addCompany: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      name: Joi.string().required().error(new InvalidParameterException('Не указано название компании')),
      city: Joi.string().allow('', null),
      appSystems: Joi.array().optional(),
    }),
    validateOptions: {
      allowUnknown: true,
    },
  },
};

const updateCompany: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор организации')),
    }),
    type: 'json',
    body: Joi.object().required().error(new InvalidParameterException('Не указана информация об организации')),
  },
};

const removeCompany: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор организации')),
    }),
  },
};

const getCompany: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор организации')),
    }),
  },
};

export { addCompany, updateCompany, removeCompany, getCompany };
