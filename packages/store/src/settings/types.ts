import { IBaseSettings, ISettings } from '@lib/types';

export type ISettingsState = {
  readonly data: ISettings<IBaseSettings>;
  readonly loading: boolean;
  readonly errorMessage: string;
};
