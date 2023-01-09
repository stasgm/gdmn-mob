import { IDeviceBinding } from '@lib/types';

import { useSelector } from '../';

const bindingById = (id?: string) => {
  return useSelector((state) => state.deviceBindings.list.find((d) => d.id === id));
};

const bindingsByUserId = (userId: string) => {
  return useSelector((state) => state.deviceBindings.list.filter((u) => u.user.id === userId));
};

const bindingsByDeviceId = (deviceId: string) => {
  return useSelector((state) => state.deviceBindings.list.filter((u) => u.device.id === deviceId));
};

const bindingsByDeviceIdAndUserId = (deviceId: string, userId: string) => {
  return useSelector((state) =>
    state.deviceBindings.list.find((u) => u.device.id === deviceId && u.user.id === userId),
  );
};

export default { bindingById, bindingsByUserId, bindingsByDeviceId, bindingsByDeviceIdAndUserId };
