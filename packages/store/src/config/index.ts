import asyncActions from './actions.async';
import { actions } from './actions';

export { default as reducer } from './reducer';
export { ConfigActionType } from './actions';
export { useConfigThunkDispatch } from './actions.async';
export default { ...asyncActions, ...actions };
