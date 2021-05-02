import { IUser } from '@lib/types';

export type IUserState = {
  readonly list: IUser[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
