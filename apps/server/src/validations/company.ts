import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

const addCompany: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      name: Joi.string().required().error(new InvalidParameterException('не указано название компании')),
    }),
  },
};

const updateCompany: Config = {
  validate: {
    params: Joi.object({
      id: Joi.string().required().error(new InvalidParameterException('не указан идентификатор организации')),
    }),
    type: 'json',
    body: Joi.object().required().error(new InvalidParameterException('не указана информация об организации')),
  },
};

const removeCompany: Config = {
  validate: {
    params: Joi.object({
      id: Joi.string().required().error(new InvalidParameterException('не указан идентификатор организации')),
    }),
  },
};

const getCompany: Config = {
  validate: {
    params: Joi.object({
      id: Joi.string().required().error(new InvalidParameterException('не указан идентификатор организации')),
    }),
  },
};

export { addCompany, updateCompany, removeCompany, getCompany };
