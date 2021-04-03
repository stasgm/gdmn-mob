import { useSelector } from 'react-redux';

import { RootState } from '../rootReducer';

const selectIsLogged = (state: RootState) => {
  const { device, user, company } = state.auth;
  return device && user && company;
};

const isLogged = useSelector(selectIsLogged);

export default { isLogged };
