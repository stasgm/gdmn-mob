import { Settings } from '@lib/types';

export type SettingsState = {
  readonly data: Settings;
  readonly loading: boolean;
  readonly loadingData: boolean;
  readonly loadingError: string;
  readonly errorMessage: string;
  readonly isInit: boolean;
};
