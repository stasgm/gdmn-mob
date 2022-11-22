import { IDevice, IUser, ICompany, INamedEntity } from '@lib/types';
import { IApiConfig } from '@lib/client-types';

export type ConnectionStatus = 'not-connected' | 'connected' | 'not-activated';

export type AuthState = {
  readonly user: IUser | undefined;
  readonly device: IDevice | undefined;
  readonly company: ICompany | undefined;
  readonly appSystem: INamedEntity | undefined;
  readonly config: IApiConfig;
  readonly connectionStatus: ConnectionStatus;
  readonly isDemo: boolean;
  readonly isInit: boolean;
  readonly loading: boolean;
  readonly loadingData: boolean;
  readonly loadingError: string;
  readonly error: boolean;
  readonly status: string;
  readonly isConfigFirst: boolean;
  readonly isLogout: boolean;
  readonly errorMessage: string;
};
