import bcrypt from 'bcrypt';
import config from '../../config';

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(config.SALT_ROUND);
  return await bcrypt.hash(password, salt);
};

export { hashPassword };
