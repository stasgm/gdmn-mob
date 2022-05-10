import { genSalt, hash } from 'bcrypt';

import config from '../../config';

const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(config.SALT_ROUND);
  return hash(password, salt);
};

export { hashPassword };
