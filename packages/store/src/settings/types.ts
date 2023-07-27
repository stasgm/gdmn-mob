import { IUserSettings, Settings } from '@lib/types';

export type SettingsState = {
  readonly data: Settings;
  readonly userData?: IUserSettings;
  readonly loading: boolean;
  readonly loadingData: boolean;
  readonly loadingError: string;
  readonly errorMessage: string;
  readonly isInit: boolean;
};
