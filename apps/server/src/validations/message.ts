import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

const newMessage: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      head: Joi.object({
        company: Joi.string().required().error(new InvalidParameterException('Некорректный формат сообщения')),
      }),
      body: Joi.object({
        type: Joi.string().required().error(new InvalidParameterException('Некорректный формат сообщения')),
        payload: Joi.string().required().error(new InvalidParameterException('Некорректный формат сообщения')),
      }),
    }),
  },
};

const getMessage: Config = {
  validate: {
    params: Joi.object({
      companyId: Joi.string().required().error(new InvalidParameterException('Не указана органиазция')),
    }),
  },
};

const removeMessage: Config = {
  validate: {
    params: Joi.object({
      companyId: Joi.string().required().error(new InvalidParameterException('Не указана органиазция')),
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор сообщения')),
    }),
  },
};

const publish: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      head: Joi.object({
        company: Joi.string().required().error(new InvalidParameterException('Некорректный формат сообщения')),
      }),
      body: Joi.object({
        type: Joi.string().required().error(new InvalidParameterException('Некорректный формат сообщения')),
        payload: Joi.string().required().error(new InvalidParameterException('Некорректный формат сообщения')),
      }),
    }),
  },
};
export { newMessage, getMessage, removeMessage, publish };
