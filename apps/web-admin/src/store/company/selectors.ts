import { useSelector } from '../';

const companyById = (id: string) => {
  return useSelector((state) => state.companies.list.find((c) => c.id === id));
};

const companyByAppSystem = (appSystemID: string) => {
  return useSelector((state) =>
    state.companies.list.filter((company) => company.appSystems?.find((item) => item.id === appSystemID)),
  );
};

export default { companyById, companyByAppSystem };
