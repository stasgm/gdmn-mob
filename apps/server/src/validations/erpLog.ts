import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

const getErpLog: Config = {
  validate: {
    query: Joi.object()
      .keys({
        companyId: Joi.string().required().error(new InvalidParameterException('Не указана организация')),
        appSystemId: Joi.string().required().error(new InvalidParameterException('Не указана подсистема')),
        start: Joi.number().optional(),
        end: Joi.number().optional(),
      })
      .options({
        allowUnknown: true,
      }),
  },
};

export { getErpLog };
