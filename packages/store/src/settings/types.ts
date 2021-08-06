import { IBaseSettings, ISettings } from '@lib/types';

export type SettingsState = {
  readonly data: ISettings<IBaseSettings>;
  readonly loading: boolean;
  readonly errorMessage: string;
};
