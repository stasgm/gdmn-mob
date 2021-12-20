import { useSelector } from 'react-redux';

import { RootState } from '../';

const isLogged = (): boolean => {
  const auth = useSelector((state: RootState) => state.auth);
  return auth && Boolean(auth.user);
};

const isLoggedWithCompany = (): boolean => {
  const connectionStatus = useSelector((state: RootState) => state.auth.connectionStatus);
  const user = useSelector((state: RootState) => state.auth.user);
  const company = useSelector((state: RootState) => state.auth.company);
  const isMock = useSelector((state: RootState) => state.auth.settings.debug?.isMock);
  return (
    Boolean(
      (connectionStatus === 'connected' && user && company)
      || (isMock && connectionStatus === 'connected'),
    )
  );
};

export default { isLogged, isLoggedWithCompany };
