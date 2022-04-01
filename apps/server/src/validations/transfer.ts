import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

import * as urlValidation from './url';

const deleteValid: Config = {
  validate: {
    params: Joi.object({
      ...urlValidation.checkURL,
      uid: Joi.string().required().error(new InvalidParameterException('Не указан uid процесса')),
    }),
  },
};

export { deleteValid };
