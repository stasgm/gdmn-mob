import { IDevice, IResponse, IUser, IUserCredentials } from '@lib/common-types';
import { IApiConfig, IDataFetch } from '@lib/common-client-types';

export interface ILoadingState {
  serverResp: IResponse<IDevice | IUser> | undefined;
  serverReq: IDataFetch;
}

export interface IAuthContextData {
  user: IUser | null | undefined;
  device: IDevice | null | undefined;
  settingsForm: boolean;
  loading: ILoadingState;
  settings: IApiConfig | undefined;
  signIn(user: IUserCredentials): Promise<void>;
  signOut(): Promise<void>;
  checkDevice(): Promise<void>;
  activate(code: string): Promise<void>;
  disconnect(): Promise<void>;
  showSettings(visible: boolean): Promise<void>;
  setSettings(settings: IApiConfig): Promise<void>;
}

const AUTH_CONTEXT_ERROR =
  'Authentication context not found. Have your wrapped your components with AuthContext.Consumer?';

export const initialState: IAuthContextData = {
  user: undefined,
  device: undefined,
  settingsForm: false,
  settings: undefined,
  loading: {
    serverResp: undefined,
    serverReq: { isLoading: false, isError: false, status: undefined },
  },
  signIn: () => {
    throw new Error(AUTH_CONTEXT_ERROR);
  },
  signOut: () => {
    throw new Error(AUTH_CONTEXT_ERROR);
  },
  checkDevice: () => {
    throw new Error(AUTH_CONTEXT_ERROR);
  },
  disconnect: () => {
    throw new Error(AUTH_CONTEXT_ERROR);
  },
  setSettings: () => {
    throw new Error(AUTH_CONTEXT_ERROR);
  },
  showSettings: () => {
    throw new Error(AUTH_CONTEXT_ERROR);
  },
  activate: () => {
    throw new Error(AUTH_CONTEXT_ERROR);
  },
};

type Action =
  | { type: 'INIT' }
  | {
      type: 'LOAD_DATA';
      device: IDevice | null | undefined;
      user: IUser | null | undefined;
      settings: IApiConfig | undefined;
    }
  | { type: 'SET_DEVICE'; device: IDevice | null }
  | { type: 'SET_DEVICE_ERROR'; text: string }
  | { type: 'SET_USER'; user: IUser | null }
  | { type: 'SET_USER_ERROR'; text: string }
  | { type: 'SET_CONNECTION' }
  | { type: 'SET_ERROR'; text: string }
  | { type: 'SET_SETTINGS'; settings: IApiConfig }
  | { type: 'SETTINGS_FORM'; visible: boolean }
  | { type: 'SET_RESPONSE'; result: boolean; data?: IDevice };

export const reducer = (state: IAuthContextData, action: Action): IAuthContextData => {
  switch (action.type) {
    case 'INIT':
      return initialState;

    case 'LOAD_DATA':
      return { ...state, device: action.device, user: action.user, settings: action.settings };

    case 'SET_DEVICE':
      return {
        ...state,
        device: action.device,
        loading: {
          serverResp: undefined,
          serverReq: { isError: false, status: undefined, isLoading: false },
        },
      };

    case 'SET_DEVICE_ERROR':
      return {
        ...state,
        device: null,
        loading: {
          serverResp: undefined,
          serverReq: { isError: true, status: action.text, isLoading: false },
        },
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.user,
        loading: {
          serverResp: undefined,
          serverReq: { isError: false, status: undefined, isLoading: false },
        },
      };

    case 'SET_USER_ERROR':
      return {
        ...state,
        user: null,
        loading: {
          serverResp: undefined,
          serverReq: { isError: true, status: action.text, isLoading: false },
        },
      };

    case 'SETTINGS_FORM':
      return {
        ...state,
        settingsForm: action.visible,
        loading: {
          serverResp: undefined,
          serverReq: { isError: false, status: undefined, isLoading: false },
        },
      };

    case 'SET_SETTINGS':
      return {
        ...state,
        settingsForm: false,
        settings: action.settings,
      };

    case 'SET_RESPONSE':
      return {
        ...state,
        loading: {
          ...state.loading,
          serverResp: {
            result: action.result,
            data: action.data,
          },
        },
      };

    /*     case 'SET_REQUEST':
          return {
            ...state,
            loading: {
              ...state.loading,
              serverReq: {
                isError: false,
                isLoading: true,
                status: undefined,
              },
            },
          }; */

    case 'SET_ERROR':
      return {
        ...state,
        loading: {
          ...state.loading,
          serverReq: {
            isError: true,
            status: action.text,
            isLoading: false,
          },
        },
      };

    case 'SET_CONNECTION':
      return {
        ...state,
        loading: {
          serverResp: undefined,
          serverReq: {
            isError: false,
            status: undefined,
            isLoading: true,
          },
        },
      };

    default:
      return state;
  }
};
