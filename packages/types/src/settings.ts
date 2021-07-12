import { IEntity } from './common';

interface ISettingsOption<T = string> extends IEntity {
  description?: string;
  data: T;
  visible?: boolean;
  sortOrder?: number;
  type: 'string' | 'date' | 'number' | 'boolean' | 'option' | 'ref';
}

type ISettings<T = Record<string, string>> = {
  [P in keyof T]?: ISettingsOption<T[P]>;
};

interface IBaseSettings {
  serverAutoCheck: boolean;
  refLoadType: boolean;
}

const baseSettings: ISettings<IBaseSettings> = {
  serverAutoCheck: {
    id: '1',
    sortOrder: 1,
    description: 'Опрашивать сервер автоматически',
    data: true,
    type: 'boolean',
  },
  refLoadType: {
    id: '2',
    description: 'Перезаписывать справочники',
    data: true,
    type: 'boolean',
    sortOrder: 2,
  },
};

// Example

/*
interface IInvSettings extends IBaseSettings {
  useCamera: boolean;
  useKbdScanner: boolean;
  serverAutoCheck: boolean;
}

const InvSettings: ISettings<IInvSettings> =  {
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

export { ISettings, ISettingsOption, IBaseSettings, baseSettings };
