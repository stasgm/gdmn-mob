import { Settings } from '@lib/types';

export type SettingsState = {
  readonly data: Settings;
  readonly loading: boolean;
  readonly errorMessage: string;
};
