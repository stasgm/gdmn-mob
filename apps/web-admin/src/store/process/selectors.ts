import { useSelector } from '..';

const processById = (id: string) => {
  return useSelector((state) => state.activationCodes.list.find((d) => d.id === id));
};

const processByCompanyId = (companyId: string) => {
  return useSelector((state) => state.activationCodes.list.find((u) => u.device?.id === companyId)?.code);
};

export default { processById, processByCompanyId };
