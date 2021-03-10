// import Api from "../service/Api";
// import Sync from "../service/Storage";
// import { AppActions, AuthActions, ServiceActions } from "../store";

import { IReferences, IModels } from './data';
import { IDocument } from './document';

export interface IBaseUrl {
  protocol: string;
  server: string;
  port: number;
  timeout: number;
  apiPath: string;
}

export interface IDataFetch {
  isLoading: boolean;
  isError: boolean;
  status?: string;
}

export interface IServiceContextProps {
  state: IServiceState;
  // actions: typeof ServiceActions;
  // apiService: Api;
  // storageService: Sync;
}

export interface IAuthContextProps {
  state: IAuthState;
  // actions: typeof AuthActions;
}

export interface IAppContextProps {
  state: IAppState;
  // actions: typeof AppActions;
}

export interface IServiceState {
  isLoading: boolean;
  serverUrl?: IBaseUrl;
  deviceId?: string;
  storagePath?: string;
}

export interface IAuthState {
  companyID?: string | null;
  userID?: string | null;
  deviceRegistered?: boolean;
  deviceActive?: boolean;
  deviceId?: string;
  profile?: {
    userName: string;
    companyName: string;
  };
}

export interface IForm {
  [name: string]: unknown;
}

export interface IForms<T = IForm> {
  [name: string]: T;
}

export interface IViewParam {
  [name: string]: unknown;
}

export interface ICompanySetting {
  [name: string]: unknown;
}

export interface IWeightCodeSettings {
  weightCode: string;
  code: number;
  weight: number;
}

export interface IAppSettings {
  synchronization?: boolean;
  autodeletingDocument?: boolean;
  barcodeReader?: boolean;
  darkTheme?: boolean;
}

export interface ICompanySettings {
  [name: string]: ICompanySetting;
}

export interface IViewParams {
  [name: string]: IViewParam;
}

export interface IAppState {
  settings?: IAppSettings;
  companySettings?: ICompanySettings;
  documents?: IDocument[];
  references?: IReferences;
  forms?: IForms;
  models?: IModels;
  viewParams: IViewParams;
}
