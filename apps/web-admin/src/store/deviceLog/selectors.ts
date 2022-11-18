import { useSelector } from '..';

const deviceLogById = (id: string) => {
  return useSelector((state) => state.deviceLogs.filesList.find((i) => i.id === id));
};

export default { deviceLogById };
