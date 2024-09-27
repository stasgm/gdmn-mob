import Joi from 'joi';

import { InvalidParameterException } from '../exceptions';

const checkURL = {
  version: Joi.string().required().error(new InvalidParameterException('Неизвестная версия приложения')),
};

export { checkURL };
