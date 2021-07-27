import { useSelector } from '../';

const deviceById = (id: string) => {
  return useSelector((state) => state.devices.list.find((d) => d.id === id));
};

export default { deviceById };
