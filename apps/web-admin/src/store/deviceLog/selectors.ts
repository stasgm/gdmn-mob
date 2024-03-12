import { useSelector } from '..';

const deviceLogFileById = (id: string) => {
  return useSelector((state) => state.deviceLogs.fileList.find((i) => i.id === id));
};

const deviceLogFileByUserAndDevice = (userId?: string, deviceId?: string) => {
  return useSelector((state) =>
    state.deviceLogs.fileList.find((i) => i.producer.id === userId && i.device.id === deviceId),
  );
};

export default { deviceLogFileById, deviceLogFileByUserAndDevice };
