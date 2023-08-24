import { useSelector } from '../';

const companyById = (id: string) => {
  return useSelector((state) => state.companies.list.find((c) => c.id === id));
};

export default { companyById };
