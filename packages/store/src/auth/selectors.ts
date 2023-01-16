import { useSelector } from 'react-redux';

import { RootState } from '../';

const isLogged = (): boolean => {
  const auth = useSelector((state: RootState) => state.auth);
  return auth && Boolean(auth.user);
};

const isLoggedWithCompany = (): boolean => {
  const { connectionStatus, user, company, device, appSystem } = useSelector((state: RootState) => state.auth);
  return Boolean(
    (connectionStatus === 'connected' || connectionStatus === 'not-checked') && user && company && device && appSystem,
  );
};

export default { isLogged, isLoggedWithCompany };
