import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

const addCompany: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      name: Joi.string().required().error(new InvalidParameterException('Не указано название компании')),
      city: Joi.string().optional().allow(''),
    }),
  },
};

const updateCompany: Config = {
  validate: {
    params: Joi.object({
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор организации')),
    }),
    type: 'json',
    body: Joi.object().required().error(new InvalidParameterException('Не указана информация об организации')),
  },
};

const removeCompany: Config = {
  validate: {
    params: Joi.object({
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор организации')),
    }),
  },
};

const getCompany: Config = {
  validate: {
    params: Joi.object({
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор организации')),
    }),
  },
};

export { addCompany, updateCompany, removeCompany, getCompany };
