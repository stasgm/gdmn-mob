import { Settings } from '@lib/types';

export type SettingsState = {
  readonly data: Settings;
  readonly loading: boolean;
  readonly loadingData: boolean;
  readonly loadErrorList: string[];
  readonly errorMessage: string;
  readonly isInit: boolean;
};
