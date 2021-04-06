// import { useStore } from 'react-redux';
import { Reducer } from 'redux';

import { StoreWithAsyncReducers } from '../';

type params = {
  name: string;
  reducer: Reducer<any, any>;
  store: StoreWithAsyncReducers;
};

const useAddReducer = ({ name, reducer, store }: params) => {
  // const store: StoreWithAsyncReducers = useStore();

  if (!store.addReducer) {
    return;
  }

  store.addReducer(name, reducer);
  console.log('end addReducer', name);
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
