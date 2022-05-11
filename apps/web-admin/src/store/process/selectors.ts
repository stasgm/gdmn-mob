import { useSelector } from '..';

const processById = (id: string) => {
  return useSelector((state) => state.processes.list.find((d) => d.id === id));
};

export default { processById };
