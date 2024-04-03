import asyncActions from './actions.async';
import { deviceActions as actions } from './actions';

export { default as deviceSelectors } from './selectors';
export const deviceActions = { ...asyncActions, ...actions };
