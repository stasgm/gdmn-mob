import { useSelector } from '..';

const deviceLogById = (id: string) => {
  return useSelector((state) => state.deviceLogs.filesList.find((d) => d.alias === id));
};

export default { deviceLogById };
