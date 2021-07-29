import { IDevice, IUser, ICompany } from '@lib/types';
import { IApiConfig } from '@lib/client-types';

export type AuthState = {
  readonly user: IUser | undefined;
  readonly device: IDevice | undefined;
  readonly company: ICompany | undefined;
  readonly settings: IApiConfig;
  readonly loading: boolean;
  readonly error: boolean;
  readonly status: string;
  readonly deviceStatus: 'init' | 'active' | 'not-activated';
};
