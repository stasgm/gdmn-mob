import { useSelector } from 'react-redux';

import { RootState } from '../';

const isLogged = () => {
  const { device, user, company } = useSelector((state: RootState) => state.auth);

  return device && user && company;
};

export default { isLogged };
