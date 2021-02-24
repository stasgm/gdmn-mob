import { DEVICE_ID, patch, remove, post } from './http.service';
import { IResponse, IDevice } from '../../../common';
import { INetworkError, IRemoveDevicesResponse, IBlockDevicesResponse, ICreateDeviceNameResponse } from '../queryTypes';

const createDevice = async (deviceName: string, userId: string) => {
  const body = JSON.stringify({
    deviceName,
    userId
  });
  const res = await post<IResponse<string>>(`/devices?deviceId=${DEVICE_ID}`, body);

  if (res.result) {
    return {
      type: 'CREATE_DEVICENAME',
      uid: res.data
    } as ICreateDeviceNameResponse;
  }
  return {
    type: 'ERROR',
    message: res.error
  } as INetworkError;
};

const deleteDevice = async (uId: string) => {
  const res = await remove<IResponse<undefined>>(`/devices/${uId}?deviceId=${DEVICE_ID}`);

  if (res.result) {
    return {
      type: 'REMOVE_DEVICES'
    } as IRemoveDevicesResponse;
  }
  return {
    type: 'ERROR',
    message: res.error
  } as INetworkError;
};

const blockDevice = async (updateDevice: Partial<IDevice>) => {
  const body = JSON.stringify(updateDevice);
  const res = await patch<IResponse<IDevice>>(`/devices/${updateDevice.id}?deviceId=${DEVICE_ID}`, body);

  if (res.result) {
    return {
      type: 'BLOCK_DEVICES',
      device: res.data
    } as unknown as IBlockDevicesResponse;
  }
  return {
    type: 'ERROR',
    message: res.error
  } as INetworkError;
};

export { deleteDevice, blockDevice, createDevice };
