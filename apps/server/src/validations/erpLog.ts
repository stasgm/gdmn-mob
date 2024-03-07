import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

import * as urlValidation from './url';

const getErpLog: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      id: Joi.string().required().error(new InvalidParameterException('Не указан идентификатор файла')),
    }),
    query: Joi.alternatives()
      .try(
        Joi.object({
          ...urlValidation.checkURL,
        }),
        Joi.object({
          ...urlValidation.checkURL,
          companyId: Joi.string().required(),
          appSystemId: Joi.string().required(),
          start: Joi.number().optional(),
          end: Joi.number().optional(),
        }),
      )
      .error(
        new InvalidParameterException(
          'Некорректный формат параметров запроса. В параметрах должны быть указаны id компании и id системы',
        ),
      ),
  },
};

export { getErpLog };
