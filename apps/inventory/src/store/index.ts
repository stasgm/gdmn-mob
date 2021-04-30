import { combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { configureStore, RootState } from '@lib/store';

import docsReducer from './documents/reducer';
import refsReducer from './references/reducer';
import messReducer from './messages/reducer';

import { DocActionType } from './documents/actions';
import { RefActionType } from './references/actions';
import { MesActionType } from './messages/actions';

type TActions = DocActionType | RefActionType | MesActionType;

export const combinedReducer = {
  docs: docsReducer,
  refs: refsReducer,
  messanges: messReducer,
};

const rootReducer = combineReducers(combinedReducer);

export const { store, persistor } = configureStore(combinedReducer);

export type AppState = ReturnType<typeof rootReducer> & RootState;
export type AppThunk = ThunkAction<void, AppState, null, Action<any>>;
export type AppDispatch = ThunkDispatch<AppState, any, TActions>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
