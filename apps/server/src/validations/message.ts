import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

import * as urlValidation from './url';

const newMessage: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      head: Joi.object({
        company: Joi.object({
          id: Joi.string().required().error(new InvalidParameterException('Некорректный формат сообщения')),
          name: Joi.string().required().error(new InvalidParameterException('Некорректный формат сообщения')),
        }),
        appSystem: Joi.string().optional(),
        producer: Joi.object().optional(),
        consumer: Joi.object().optional(),
        version: Joi.number().optional(),
        dateTime: Joi.string().optional(),
      }),
      body: Joi.object({
        type: Joi.string().required().error(new InvalidParameterException('Некорректный формат сообщения')),
        version: Joi.number().optional(),
        payload: Joi.alternatives()
          .try(Joi.object(), Joi.array())
          .required()
          .error(new InvalidParameterException('Некорректный формат сообщения')),
      }),
      id: Joi.string().optional(),
      status: Joi.string().optional(),
    }),
  },
};

const getMessages: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
    }),
    query: Joi.object({
      companyId: Joi.string().required().error(new InvalidParameterException('Не указана организация')),
      appSystemId: Joi.string().required().error(new InvalidParameterException('Не указана подсистема')),
    }),
  },
};

const removeMessage: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор сообщения')),
    }),
    query: Joi.object({
      companyId: Joi.string().required().error(new InvalidParameterException('Не указана организация')),
      appSystemId: Joi.string().required().error(new InvalidParameterException('Не указана подсистема')),
    }),
  },
};

const clear: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
    }),
    query: Joi.object({
      companyId: Joi.string().required().error(new InvalidParameterException('Не указана организация')),
      appSystemId: Joi.string().required().error(new InvalidParameterException('Не указана подсистема')),
    }),
  },
};
// const publish: Config = {
//   validate: {
//     type: 'json',
//     body: Joi.object({
//       head: Joi.object({
//         company: Joi.string().required().error(new InvalidParameterException('Некорректный формат сообщения')),
//       }),
//       body: Joi.object({
//         type: Joi.string().required().error(new InvalidParameterException('Некорректный формат сообщения')),
//         payload: Joi.string().required().error(new InvalidParameterException('Некорректный формат сообщения')),
//       }),
//     }),
//   },
// };

export { newMessage, getMessages, removeMessage, clear };
