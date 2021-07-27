import { IDeviceBinding } from '@lib/types';

export interface IDeviceBindingBindingQueryResponse {
  type:
    | 'ADD_DEVICEBINDING'
    | 'GET_DEVICEBINDING'
    | 'GET_DEVICEBINDINGS'
    | 'BLOCK_DEVICEBINDINGS'
    | 'UPDATE_DEVICEBINDING'
    | 'REMOVE_DEVICEBINDING';
}

export interface IAddDeviceBindingResponse extends IDeviceBindingBindingQueryResponse {
  type: 'ADD_DEVICEBINDING';
  deviceBinding: IDeviceBinding;
}

export interface IGetDeviceBindingsResponse extends IDeviceBindingBindingQueryResponse {
  type: 'GET_DEVICEBINDINGS';
  deviceBindings: IDeviceBinding[];
}

export interface IGetDeviceBindingResponse extends IDeviceBindingBindingQueryResponse {
  type: 'GET_DEVICEBINDING';
  deviceBinding: IDeviceBinding;
}

export interface IUpdateDeviceBindingResponse extends IDeviceBindingBindingQueryResponse {
  type: 'UPDATE_DEVICEBINDING';
  deviceBinding: IDeviceBinding;
}

export interface IRemoveDeviceBindingResponse extends IDeviceBindingBindingQueryResponse {
  type: 'REMOVE_DEVICEBINDING';
}

export type QueryResponse =
  | IAddDeviceBindingResponse
  | IGetDeviceBindingsResponse
  | IGetDeviceBindingResponse
  | IUpdateDeviceBindingResponse
  | IRemoveDeviceBindingResponse;
