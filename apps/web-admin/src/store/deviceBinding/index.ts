import asyncActions from './actions.async';
import { deviceBindingActions as actions } from './actions';

export { default as bindingSelectors } from './selectors';
export const bindingActions = { ...asyncActions, ...actions };
