import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

const addUser: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      name: Joi.string().required().error(new InvalidParameterException('Не указано имя пользователя')),
      password: Joi.string().required().error(new InvalidParameterException('Не указан пароль')),
    }),
  },
};

const updateUser: Config = {
  validate: {
    params: Joi.object({
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор пользователя')),
    }),
    type: 'json',
    body: Joi.object().required().error(new InvalidParameterException('Не указаны данные пользователя')),
  },
};

const removeUser: Config = {
  validate: {
    params: Joi.object({
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор пользователя')),
    }),
  },
};

const getUser: Config = {
  validate: {
    params: Joi.object({
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор пользователя')),
    }),
  },
};

export { addUser, updateUser, removeUser, getUser };
