import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

import * as urlValidation from './url';

const newMessage: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      head: Joi.object({
        company: Joi.object({
          id: Joi.string().required().error(new InvalidParameterException('Некорректный формат объекта компании')),
          name: Joi.string().required().error(new InvalidParameterException('Некорректный формат объекта компании')),
        }),
        appSystem: Joi.object({
          id: Joi.string().required().error(new InvalidParameterException('Некорректный формат объекта подсистемы')),
          name: Joi.string().required().error(new InvalidParameterException('Некорректный формат объекта подсистемы')),
        }),
        producer: Joi.object({
          id: Joi.string().required().error(new InvalidParameterException('Некорректный формат объекта отправителя')),
          name: Joi.string().required().error(new InvalidParameterException('Некорректный формат объекта отправителя')),
        }),
        consumer: Joi.object({
          id: Joi.string().required().error(new InvalidParameterException('Некорректный формат объекта получателя')),
          name: Joi.string().required().error(new InvalidParameterException('Некорректный формат объекта получателя')),
        }),
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
    query: Joi.object()
      .keys({
        companyId: Joi.string().required().error(new InvalidParameterException('Не указана организация')),
        appSystemId: Joi.string().required().error(new InvalidParameterException('Не указана подсистема')),
      })
      .options({
        allowUnknown: true,
      }),
  },
};

const removeMessage: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор сообщения')),
    }),
    query: Joi.object()
      .keys({
        companyId: Joi.string().required().error(new InvalidParameterException('Не указана организация')),
        appSystemId: Joi.string().required().error(new InvalidParameterException('Не указана подсистема')),
      })
      .options({
        allowUnknown: true,
      }),
  },
};

const clear: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
    }),
    query: Joi.object()
      .keys({
        companyId: Joi.string().required().error(new InvalidParameterException('Не указана организация')),
        appSystemId: Joi.string().required().error(new InvalidParameterException('Не указана подсистема')),
      })
      .options({
        allowUnknown: true,
      }),
  },
};

export { newMessage, getMessages, removeMessage, clear };
