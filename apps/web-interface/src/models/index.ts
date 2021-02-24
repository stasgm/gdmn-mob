export interface IRootState {
  app: IApp;
  profile: IUserProfile | null;
  settings: ISettings;
}

export interface ISettings {
  currencies: Array<string>;
}

export interface IApp {
  isAuth: boolean | undefined;
  isMenuOpen: boolean;
  message: IAppMessage | null;
}

export interface IDataFetch {
  isLoading: boolean;
  isError: boolean;
  status?: string;
}

export interface IUserProfile {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  age: string;
  location: string;
  phone: string;
  website: string;
  email: string;
  avatarurl: string;
}

export interface ITask {
  id: string | null;
  name: string;
  note?: string;
  public?: boolean;
  scheduled_date?: Date;
  created_at?: Date;
}

export interface IAppMessage {
  status: MessageLevel;
  text: string;
}

export enum MessageLevel {
  information,
  warring,
  error
}

export interface IBank {
  id?: string;
  name: string;
  code: string;
  abbreviation: string;
  updated_at?: string;
}

export interface ICurrency {
  name: string;
  code: string;
  abbreviation: string;
  scale: number;
  updated_at?: string;
}

export interface IRate {
  bid_rate: number;
  ask_rate: number;
  date: string;
  scale: number;
  department: string;
  currency: ICurrency;
  bank: IBank;
  updated_at?: string;
}
