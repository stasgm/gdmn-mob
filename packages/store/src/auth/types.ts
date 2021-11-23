import { IDevice, IUser, ICompany } from '@lib/types';
import { IApiConfig } from '@lib/client-types';

export type ConnectionStatus = 'init' | 'demo' | 'not-connected' | 'connected' | 'not-activated';

export type AuthState = {
  readonly user: IUser | undefined;
  readonly device: IDevice | undefined;
  readonly company: ICompany | undefined;
  readonly userToken: string | undefined;
  readonly settings: IApiConfig;
  readonly loading: boolean;
  readonly error: boolean;
  readonly status: string;
  readonly connectionStatus: ConnectionStatus;
};
