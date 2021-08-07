import { Joi, Config } from 'koa-joi-router';

import { InvalidParameterException } from '../exceptions';

// const checkURL: Config = {
//   validate: {
//     params: Joi.object({
//       v: Joi.string().required().error(new InvalidParameterException('Неизвестная версия приложения')),
//     }),
//   },
// };

const checkURL = {
  version: Joi.string().required().error(new InvalidParameterException('Неизвестная версия приложения')),
};

export { checkURL };
