import React, { useEffect } from 'react';

import { IAuthState, IAuthContextProps } from '../../model/types';
import { useStore as useServiceStore } from '../Service/store';
import { useTypesafeActions } from '../utils';
import { AuthActions } from './actions';
import { reducer, initialState } from './reducer';

const defaultAppState: IAuthContextProps = {
  state: initialState,
  actions: AuthActions,
};

const createStoreContext = () => {
  const StoreContext = React.createContext<IAuthContextProps>(defaultAppState);

  const StoreProvider = ({ children }) => {
    const [state, actions] = useTypesafeActions<IAuthState, typeof AuthActions>(reducer, initialState, AuthActions);
    const { actions: storeActions } = useServiceStore();

    useEffect(() => {
      if (state.userID && state.companyID) {
        storeActions.setStoragePath(`${state.userID}/${state.companyID}`);
      }
    }, [state.userID, state.companyID, actions, storeActions]);

    return <StoreContext.Provider value={{ state, actions }}>{children}</StoreContext.Provider>;
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
};

export const { StoreProvider, useStore } = createStoreContext();
