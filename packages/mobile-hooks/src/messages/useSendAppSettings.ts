import api from '@lib/client-api';
import { appActions, authActions, useDispatch, useSelector } from '@lib/store';
import { useCallback } from 'react';

import { IDeviceLog } from '@lib/types';

import { mobileRequest } from '../mobileRequest';
import { generateId } from '../utils';

export const useSendAppSettings = () => {
  const dispatch = useDispatch();
  const { config, user, company, device } = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settings.data);
  const deviceId = config.deviceId;

  return useCallback(async () => {
    const addError = (name: string, message: string, tempErrs: IDeviceLog[]) => {
      const err = {
        id: generateId(),
        name,
        date: new Date().toISOString(),
        message,
      };
      dispatch(appActions.addErrorNotice(err));
      tempErrs.push(err);
    };
    const tempErrs: IDeviceLog[] = [];
    if (user && device && company) {
      console.log('params', {
        companyId: company.id,
        deviceId: device.id,
        userId: user.id,
      });
      const getDeviceBindingResponse = await api.deviceBinding.getDeviceBindings(mobileRequest(dispatch, authActions), {
        deviceId: device.id,
        userId: user.id,
      });

      if (getDeviceBindingResponse.type === 'GET_DEVICEBINDINGS') {
        const deviceBinding = getDeviceBindingResponse.deviceBindings[0];
        console.log('deviceBinding', getDeviceBindingResponse.deviceBindings);
        if (deviceBinding) {
          const updateDeviceBindingResponse = await api.deviceBinding.updateDeviceBinding(
            mobileRequest(dispatch, authActions),
            { ...deviceBinding, settings },
          );
          if (updateDeviceBindingResponse.type !== 'UPDATE_DEVICEBINDING') {
            addError(
              'sendAppSettings: api.deviceBinding.updateDeviceBinding',
              updateDeviceBindingResponse.message,
              tempErrs,
            );
          }
        }
      } else {
        addError('sendAppSettings: api.deviceBinding.getDeviceBindings', getDeviceBindingResponse.message, tempErrs);
      }
    }
  }, [user, device, company, dispatch, settings]);
};
