// import asyncActions from './actions.async';
import { actions } from './actions';

export { default as reducer } from './reducer';
export { AppPalletActionType } from './actions';
export { useAppPalletThunkDispatch } from './actions.async';
export default { ...actions };
// export default { ...asyncActions, ...actions };
