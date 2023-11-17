import { useSelector } from '../';

const deviceById = (id?: string) => {
  return useSelector((state) => state.devices.list.find((d) => d.id === id));
};

const deviceByCompanyId = (companyId?: string) => {
  return useSelector((state) => state.devices.list.filter((d) => d.company?.id === companyId));
};

export default { deviceById, deviceByCompanyId };
