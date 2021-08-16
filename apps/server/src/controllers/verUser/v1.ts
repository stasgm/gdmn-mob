import { IUser } from '@lib/types';

import { userService } from '../../services';

const myFunction = async (params: Record<string, string | number>): Promise<IUser[]> => {
  const res: IUser[] = await userService.findAll(params);

  res.splice(1, res.length);
  res[0].name = 'Data for version 1.0';

  return res;
};

const myFunction_2 = async (id: string): Promise<IUser | undefined> => {
  const user = await userService.findOne(id);

  return user;
};

export { myFunction, myFunction_2 };
