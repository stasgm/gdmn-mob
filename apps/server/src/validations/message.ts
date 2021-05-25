import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

const newMessage: Config = {
  validate: {
    type: 'json',
    body: Joi.object({
      head: Joi.string().required().error(new InvalidParameterException('отсутствует заголовок сообщения')),
      body: Joi.string().required().error(new InvalidParameterException('отсутствует сообщение')),
    }),
  },
};

export { newMessage };
