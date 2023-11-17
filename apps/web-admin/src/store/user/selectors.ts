import { useSelector } from '../';

const usersByCompanyId = (companyId?: string) => {
  return useSelector((state) => state.users.list.filter((u) => u.company?.id === companyId));
};

const userById = (id: string) => {
  return useSelector((state) => state.users.list.find((d) => d.id === id));
};

const usersByDeviceId = (deviceId: string) => {
  const deviceUsers = useSelector((state) => state.deviceBindings.list.filter((i) => i.device.id === deviceId));

  return useSelector((state) => state.users.list.filter((u) => deviceUsers.find((d) => d.user.id === u.id)));
};

export default { userById, usersByCompanyId, usersByDeviceId };
