import { useSelector } from 'react-redux';

import { RootState } from '../';

const isLogged = (): boolean => {
  const auth = useSelector((state: RootState) => state.auth);
  return auth && Boolean(auth.user);
};

const isLoggedWithCompany = (): boolean => {
  const auth = useSelector((state: RootState) => state.auth);
  return (
    auth &&
    Boolean((auth.connectionStatus === 'connected' && auth.user && auth.company) || (auth.settings.debug?.isMock && auth.connectionStatus === 'connected'))
  );
};

export default { isLogged, isLoggedWithCompany };
