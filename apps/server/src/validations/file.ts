import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

import * as urlValidation from './url';

const removeFile: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор файла')),
    }),
  },
};

const getFile: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор файла')),
    }),
  },
};

const updateFile: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор файла')),
    }),
    type: 'json',
    body: Joi.alternatives()
      .try(Joi.object(), Joi.array())
      .required()
      .error(new InvalidParameterException('Некорректный формат содержимого файла')),
  },
};

export { removeFile, getFile, updateFile };
