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
}

type Settings<T = Record<string, SettingValue>> = {
  [P in keyof T]: ISettingsOption<T[P]>;
};

interface IBaseSettings {
  autoSync: boolean;
  refLoadType: boolean;
  cleanDocTime: number;
  getReferences: boolean;
  synchPeriod: number;
  [name: string]: SettingValue;
}

// Example

/*
interface IInvSettings extends IBaseSettings {
  useCamera: boolean;
  useKbdScanner: boolean;
  serverAutoCheck: boolean;
}
const InvSettings: Settings<IInvSettings> =  {
  ...baseSettings,
  useCamera: {
    id: '11',
    description: 'Использовать камеру телефона для считывания штрихкодов',
    data: true,
    type: 'boolean',
    sortOrder: 1,
  },
  serverAutoCheck: {
    id: '2',
    sortOrder: 2,
    description: 'Опрашивать сервер автоматически',
    data: true,
    type: 'boolean',
  },
}; */

export { Settings, ISettingsOption, IBaseSettings };
