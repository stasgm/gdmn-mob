import { useSelector } from 'react-redux';

import { RootState } from '../';

const isLogged = (): boolean => {
  const auth = useSelector((state: RootState) => state.auth);
  return auth && Boolean(auth.user);
};

const isLoggedWithCompany = (): boolean => {
  const auth = useSelector((state: RootState) => state.auth);
  return auth && Boolean(auth.deviceStatus === 'active' && auth.user && auth.company);
};

export default { isLogged, isLoggedWithCompany };
