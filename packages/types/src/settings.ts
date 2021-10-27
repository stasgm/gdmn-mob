import { IEntity } from './common';

interface ISettingsOption<T = string> extends IEntity {
  description?: string;
  data: T;
  visible?: boolean;
  sortOrder?: number;
  type: 'string' | 'date' | 'number' | 'boolean' | 'option' | 'ref';
}

type Settings<T = Record<string, string>> = {
  [P in keyof T]?: ISettingsOption<T[P]>;
};

interface IBaseSettings {
  serverAutoCheck: boolean;
  refLoadType: boolean;
  cleanDocTime: number;
  [name: string]: string | number | boolean;
}

interface IAppSettings extends IBaseSettings {
  serverName: string;
  serverPort: string;
  timeout: number;
}

const IAppSettings: Settings<IAppSettings> =  {
  // ...baseSettings,
  serverName: {
    id: '11',
    description: 'Адрес сервера',
    data: '', //?
    type: 'string',
    sortOrder: 1,
  },
  serverPort: {
    id: '2',
    sortOrder: 2,
    description: 'Порт',
    data: '',
    type: 'string',
  },
  timeout: {
    id: '3',
    sortOrder: 3,
    description: 'Время ожидания',
    data: 1,
    type: 'number',
  },
};

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
