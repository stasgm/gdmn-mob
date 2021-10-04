import { IBaseSettings, Settings } from '@lib/types';

export type SettingsState = {
  readonly data: Settings<IBaseSettings>;
  readonly loading: boolean;
  readonly errorMessage: string;
};
