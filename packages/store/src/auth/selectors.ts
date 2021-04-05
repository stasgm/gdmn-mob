import { useSelector } from 'react-redux';

import { RootState } from '../';

const isLogged = (): boolean => {
  const { device, user } = useSelector((state: RootState) => state.auth);
  return Boolean(device && user);
};

const isLoggedWithCompany = (): boolean => {
  const { device, user, company } = useSelector((state: RootState) => state.auth);
  return Boolean(device && user && company);
};

export default { isLogged, isLoggedWithCompany };
