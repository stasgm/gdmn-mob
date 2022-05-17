import { IUser } from '@lib/types';

import { userService } from '../../services';

const myFunction = async (params: Record<string, string | number>): Promise<IUser[]> => {
  const res: IUser[] = userService.findMany(params);

  res.splice(1, res.length);
  res[0].name = 'Data for version 2.0';

  return res;
};

const myFunction_3 = async (id: string): Promise<IUser | undefined> => {
  const user = userService.findOne(id);

  return user;
};

export { myFunction, myFunction_3 };
