// import asyncActions from './actions.async';
import { actions } from './actions';

export { default as reducer } from './reducer';
export { AppInventoryActionType } from './actions';
export { useAppInventoryThunkDispatch } from './actions.async';
export default { ...actions };
// export default { ...asyncActions, ...actions };
