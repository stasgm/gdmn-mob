import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

const newMessage: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      head: Joi.object({
        company: Joi.string().required().error(new InvalidParameterException('некорректный формат сообщения')),
      }),
      body: Joi.object({
        type: Joi.string().required().error(new InvalidParameterException('некорректный формат сообщения')),
        payload: Joi.string().required().error(new InvalidParameterException('некорректный формат сообщения')),
      }),
    }),
  },
};

const getMessage: Config = {
  validate: {
    params: Joi.object({
      companyId: Joi.string().required().error(new InvalidParameterException('не указана органиазция')),
    }),
  },
};

const removeMessage: Config = {
  validate: {
    params: Joi.object({
      companyId: Joi.string().required().error(new InvalidParameterException('не указана органиазция')),
      id: Joi.string().required().error(new InvalidParameterException('не указан идентификатор сообщения')),
    }),
  },
};

const publish: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      head: Joi.object({
        company: Joi.string().required().error(new InvalidParameterException('некорректный формат сообщения')),
      }),
      body: Joi.object({
        type: Joi.string().required().error(new InvalidParameterException('некорректный формат сообщения')),
        payload: Joi.string().required().error(new InvalidParameterException('некорректный формат сообщения')),
      }),
    }),
  },
};
export { newMessage, getMessage, removeMessage, publish };
