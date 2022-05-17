import { genSaltSync, hashSync } from 'bcrypt';

import config from '../../config';

export const hashPassword = (password: string): string => hashSync(password, genSaltSync(config.SALT_ROUND));
