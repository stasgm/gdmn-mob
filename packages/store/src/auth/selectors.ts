import { useSelector } from 'react-redux';

import { RootState } from '../';

const isLogged = (): boolean => {
  const auth = useSelector((state: RootState) => state.auth);
  return auth && Boolean(auth.user);
};

const isLoggedWithCompany = (): boolean => {
  const { connectionStatus, user, company, device } = useSelector((state: RootState) => state.auth);
  return Boolean(connectionStatus === 'connected' && user && company && device);
};

export default { isLogged, isLoggedWithCompany };
