import { IDevice } from '@lib/types';

export interface IDeviceQueryResponse {
  type:
    | 'ADD_DEVICE'
    | 'GET_DEVICE'
    | 'GET_DEVICES'
    | 'GET_USERS_BY_DEVICE'
    | 'BLOCK_DEVICES'
    | 'UPDATE_DEVICE'
    | 'REMOVE_DEVICE';
}

export interface IAddDeviceResponse extends IDeviceQueryResponse {
  type: 'ADD_DEVICE';
  device: IDevice;
}

export interface IGetDevicesResponse extends IDeviceQueryResponse {
  type: 'GET_DEVICES';
  devices: IDevice[];
}

export interface IGetDeviceResponse extends IDeviceQueryResponse {
  type: 'GET_DEVICE';
  device: IDevice;
}

export interface IGetUsersByDeviceResponse extends IDeviceQueryResponse {
  type: 'GET_USERS_BY_DEVICE';
  userList: IDevice[];
}

export interface IUpdateDeviceResponse extends IDeviceQueryResponse {
  type: 'UPDATE_DEVICE';
  device: IDevice;
}

export interface IRemoveDeviceResponse extends IDeviceQueryResponse {
  type: 'REMOVE_DEVICE';
}

export type QueryResponse =
  | IAddDeviceResponse
  | IGetDevicesResponse
  | IGetDeviceResponse
  | IGetUsersByDeviceResponse
  | IUpdateDeviceResponse
  | IRemoveDeviceResponse;
