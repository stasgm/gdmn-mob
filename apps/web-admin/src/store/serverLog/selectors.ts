import { useSelector } from '..';

const serverLogById = (id: string) => {
  return useSelector((state) => state.serverLogs.list.find((i) => i.id === id));
};

export default { serverLogById };
