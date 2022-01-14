import { IEntity, ISortEntity } from './common';

export type SettingValue = string | number | boolean;

interface ISettingsOption<T = SettingValue> extends IEntity {
  description?: string;
  data: T;
  visible?: boolean;
  sortOrder?: number;
  type: 'string' | 'date' | 'number' | 'boolean' | 'option' | 'ref';
  group?: ISortEntity;
}

type Settings<T = Record<string, SettingValue>> = {
  [P in keyof T]?: ISettingsOption<T[P]>;
};

interface IBaseSettings {
  serverAutoCheck: boolean;
  refLoadType: boolean;
  cleanDocTime: number;
  scannerUse: boolean;
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

// export type SettingValueDoc = string | number | boolean | undefined;
// export type RefTypeChoose = 'string' | 'date' | 'number' | 'boolean' | 'option' | 'ref';

// interface ISettingsOptionDoc extends IEntity {
//   description: string;
//   type: RefTypeChoose;
//   refName?: string;
//   sortOrder?: number;
//   clearInput?: boolean;
//   disabled?: boolean;
//   onChangeText?: string;
//   value?: any;
//   requeried?: boolean;
// }

// type MetaData1<T = Record<string, SettingValueDoc>> = {
//   [P in keyof T]?: ISettingsOptionDoc<T[P]>;
// };

export { Settings, ISettingsOption, IBaseSettings };
