import { useSelector } from '..';

const processById = (id: string) => {
  return useSelector((state) => state.processes.list.find((d) => d.id === id));
};

const processByCompanyId = (companyId: string) => {
  return useSelector((state) => state.processes.list.find((u) => u?.companyId === companyId)?.companyId);
};

export default { processById, processByCompanyId };
