import asyncActions from './actions.async';
import { actions } from './actions';

export { default as reducer } from './reducer';
export { MsgActionType } from './actions';

export { useMsgThunkDispatch } from './actions.async';

export default { ...asyncActions, ...actions };
