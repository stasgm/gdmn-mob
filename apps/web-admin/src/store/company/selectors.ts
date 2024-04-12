import { useSelector } from '../';

const companyById = (id: string) => {
  return useSelector((state) => state.companies.list.find((c) => c.id === id));
};

const companyByAppSystemId = (appSystemId: string) => {
  return useSelector((state) =>
    state.companies.list.filter((company) => company.appSystems?.find((item) => item.id === appSystemId)),
  );
};

export default { companyById, companyByAppSystemId };
