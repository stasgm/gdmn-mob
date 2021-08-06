import asyncActions from './actions.async';
import { actions } from './actions';

export { default as reducer } from './reducer';
export { AuthActionType } from './actions';
export { useAuthThunkDispatch } from './actions.async';
export default { ...asyncActions, ...actions };
