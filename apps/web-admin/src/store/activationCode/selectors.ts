import { useSelector } from '..';

const activationCodeById = (id: string) => {
  return useSelector((state) => state.activationCodes.list.find((d) => d.id === id));
};

const activationCodeByDeviceId = (deviceId: string) => {
  return useSelector((state) => state.activationCodes.list.find((u) => u.device?.id === deviceId)?.code);
};

export default { activationCodeById, activationCodeByDeviceId };
