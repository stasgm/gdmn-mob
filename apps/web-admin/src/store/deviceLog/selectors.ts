import { useSelector } from '..';

const deviceLogById = (id: string) => {
  return useSelector((state) => state.deviceLogs.filesList.find((i) => i.id === id));
};

const deviceLogByUserDeviceIds = (userId?: string, deviceId?: string) => {
  return useSelector((state) =>
    state.deviceLogs.filesList.find((i) => i.contact.id === userId && i.device.id === deviceId),
  );
};

export default { deviceLogById, deviceLogByUserDeviceIds };
