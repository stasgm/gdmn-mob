import { useSelector } from 'react-redux';

import { RootState } from '../';

const isLogged = (): boolean => {
  const user = useSelector((state: RootState) => state.auth.user);
  return Boolean(user);
};

const isLoggedWithCompany = (): boolean => {
  const { connectionStatus, user, company, device, appSystem } = useSelector((state: RootState) => state.auth);
  return Boolean(
    (connectionStatus === 'connected' || connectionStatus === 'not-checked') && user && company && device && appSystem,
  );
};

export default { isLogged, isLoggedWithCompany };
