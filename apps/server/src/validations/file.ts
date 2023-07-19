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

const deleteFiles: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
    }),
    type: 'json',
    body: Joi.object({
      ids: Joi.array().items(Joi.string()).required(),
      folderName: Joi.string(),
    }).error(new InvalidParameterException('Некорректный формат списка  файлов')),
  },
};

export { removeFile, getFile, updateFile, deleteFiles };
