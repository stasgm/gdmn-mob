import { IUser } from '@lib/types';

import { IPageParam } from '../../types';

export type IUserState = {
  readonly list: IUser[];
  readonly loading: boolean;
  readonly errorMessage: string;
  readonly pageParams?: IPageParam;
};
