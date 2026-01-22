import { IEntity, ISettingsGroup } from './common';

export type SettingValue = string | number | boolean | Array<any>;

interface ISettingsOption<T = SettingValue> extends IEntity {
  description?: string;
  data: T;
  visible?: boolean;
  sortOrder?: number;
  type: 'string' | 'date' | 'number' | 'boolean' | 'option' | 'ref' | 'sets';
  group?: ISettingsGroup;
  groupInGroup?: ISettingsGroup;
  readonly?: boolean;
  checkSettingsCode?: boolean;
}

type Settings<T = Record<string, SettingValue>> = {
  [P in keyof T]: ISettingsOption<T[P]>;
};

interface IBaseSettings {
  autoSync: boolean;
  refLoadType: boolean;
  cleanDocTime: number;
  cleanDraftDocTime: number;
  cleanReadyDocTime: number;
  cleanSentDocTime: number;
  getReferences: boolean;
  synchPeriod: number;
  [name: string]: SettingValue;
}

interface IServerConfig {
  protocol: string;
  port: number;
}

export { Settings, ISettingsOption, IBaseSettings, IServerConfig };
