import { useSelector } from '..';

const processById = (id: string) => {
  return useSelector((state) => state.processes.list.find((d) => d.id === id));
};

const companyByProcessId = (id: string) => {
  const companyId = useSelector((state) => state.processes.list.find((p) => p?.id === id))?.companyId;
  return useSelector((state) => state.companies.list.find((u) => u?.id === companyId));
};

export default { processById, companyByProcessId };
