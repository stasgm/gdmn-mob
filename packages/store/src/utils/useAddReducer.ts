import { useStore } from 'react-redux';
import { Reducer } from 'redux';

import { StoreWithAsyncReducers } from '../';

const useAddReducer = (name: string, reducer: Reducer<any, any>) => {
  const store: StoreWithAsyncReducers = useStore();

  if (!store.addReducer) {
    return;
  }

  store.addReducer(name, reducer);
};

/* interface IReducers {
  [name: string]: Reducer<any, any>;
}

const useAddReducers = (reducers: IReducers) => {
  const store: StoreWithAsyncReducers = useStore();

  if (!store.addReducer) {
    return;
  }

  Object.keys(reducers).forEach((key) => {
    if (reducers?.[key]) {
      store.addReducer(key, reducers[key]);
    }
  });
}; */

export default useAddReducer;
