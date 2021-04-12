import { ICompany, IDevice, IUser } from '@lib/types';
import { IApiConfig } from '@lib/client-types';

export type IAuthState = {
  readonly user: IUser | null | undefined;
  readonly device: IDevice | null | undefined;
  readonly company: ICompany | null | undefined;
  readonly settings: IApiConfig | undefined;
  readonly loading: boolean;
  readonly error: boolean;
  readonly status: string;
};
