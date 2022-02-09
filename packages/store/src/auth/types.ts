import { IDevice, IUser, ICompany } from '@lib/types';
import { IApiConfig } from '@lib/client-types';

export type ConnectionStatus = 'not-connected' | 'connected' | 'not-activated';

export type AuthState = {
  readonly user: IUser | undefined;
  readonly device: IDevice | undefined;
  readonly company: ICompany | undefined;
  readonly userToken: string | undefined;
  readonly config: IApiConfig;
  readonly connectionStatus: ConnectionStatus;
  readonly isDemo: boolean;
  readonly isInit: boolean;
  readonly loading: boolean;
  readonly loadingData: boolean;
  readonly loadingError: string;
  readonly error: boolean;
  readonly status: string;
};
